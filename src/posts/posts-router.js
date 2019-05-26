'use strict';

const express = require('express');
const path = require('path');
const PostsService = require('./posts-service');
const { requireAuth } = require('../middleware/jwt-auth');

const postsRouter = express.Router();
const jsonBodyParser = express.json();

postsRouter
  .route('/')
  .get((req, res, next) => {
    PostsService.getAllPosts(req.app.get('db'))
      .then(posts => {
        res.json(posts);
      })
      .catch(next);
  });

  postsRouter
  .route('/:post_id')
  .all(checkPostExists)
  .get((req, res) => {
    res.json(res.post)
  })

  postsRouter.route('/:post_id/comments/')
  .all(checkPostExists)
  .get((req, res, next) => {
    PostsService.getCommentsForPost(
      req.app.get('db'),
      req.params.post_id
    )
      .then(comments => {
        return res.json(comments)
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkPostExists(req, res, next) {
  try {
    const post = await PostsService.getById(
      req.app.get('db'),
      req.params.post_id
    )

    if (!post)
      return res.status(404).json({
        error: `Post doesn't exist`
      })

    res.post = post
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = postsRouter

// Server entrypoint - handles new post calls from PostForm.js => article-api-service.js
postsRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const {title, image, content, rating } = req.body;
    const newPost = { title, image, content, rating };
    for (const [key, value] of Object.entries(newPost))
      if (value === null || value === undefined)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    
  //  newPost.user_id = req.subscriber.id;

    PostsService.insertPost(
      req.app.get('db'),
      newPost
    )
      .then(post => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.id}`))
          .json(PostsService.serializePostComment(post));
      })
      .catch(next);
  });

module.exports = postsRouter;
