'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const postsRouter = require('./posts/posts-router');
const commentsRouter = require('./comments/comments-router');
const authRouter = require('./auth/auth-router');
const subscribersRouter = require('./subscribers/subscribers-router')
const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(cors());
app.use(helmet());

//Express uses these routes to add things to the db, ask the db for assets, and validate users on behalf of the client 
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/subscribers',subscribersRouter);


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: 'Server erro' };
  } else {
    response = { error: error.message, object: error };
  }
  res.status(500).json(response);
});

module.exports = app;
