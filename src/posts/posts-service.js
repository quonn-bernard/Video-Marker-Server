const xss = require('xss')
const Treeize = require('treeize')

// inserts/searches for blog posts in blog_db/posts table
const PostsService = {

  // gets all posts...lol
  getAllPosts(db) {
    return db
      .from('posts AS pos')
      .select(
        'pos.id',
        'pos.title',
        'pos.date_created',
        'pos.content',
        'pos.image',
        'pos.rating',
        ...userFields,
        db.raw(
          'count(DISTINCT rev) AS number_of_comments'
        ),
      )
      .leftJoin(
        'comments AS rev',
        'pos.id',
        'rev.post_id',
      )
      .leftJoin(
        'subscribers AS usr',
        'pos.user_id',
        'usr.id',
      )
      .groupBy('pos.id', 'usr.id');
  },

  getById(db, id) {
    return PostsService.getAllPosts(db)
      .where('pos.id', id)
      .first()
  },
  
  getCommentsForPost(db, post_id) {
    return db
      .from('comments AS rev')
      .select(
        'rev.id',
        'rev.text',
        'rev.date_created',
        ...userFields,
      )
      .where('rev.post_id', post_id)
      .leftJoin(
        'subscribers AS usr',
        'rev.subscriber_id',
        'usr.id',
      )
      .groupBy('rev.id', 'usr.id')
  },

  getCurrentUserPosts(db, userName) {
    return db
      .from('subscribers AS usr')
      .select(
        ...userFields,
      )
      .where('usr.user_name', userName)
      // .leftJoin(
      //   'subscribers AS usr',
      //   'rev.subscriber_id',
      //   'usr.id',
      // )
      // .groupBy('rev.id', 'usr.id')
  },

  // serializePosts(posts) {
  //   return posts.map(this.serializePost)
  // },

  // serializePost(post) {
  //   const postTree = new Treeize()

  //   // Some light hackiness to allow for the fact that `treeize`
  //   // only accepts arrays of objects, and we want to use a single
  //   // object.
  //   const postData = postTree.grow([ post ]).getData()[0]

  //   return {
  //     id: postData.id,
  //     title: xss(postData.title),
  //     content: xss(postData.content),
  //     date_created: postData.date_created,
  //     image: postData.image,
  //     user: postData.user || {},
  //     number_of_comments: Number(postData.number_of_comments) || 0,
  //     // average_review_rating: Math.round(postData.average_review_rating) || 0,
  //   }
  // },

  serializePostComments(comments) {
    return comments.map((comment) => this.serializePostComment(comment))
  },

  serializePostComment(comment) {
    const commentTree = new Treeize()
  
    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const commentData = commentTree.grow([ comment ]).getData()[0]
  
    return {
      id: commentData.id,
      // rating: commentData.rating,
      post_id: commentData.post_id,
      text: xss(commentData.text),
      subscriber: commentData.subscriber || {},
      date_created: commentData.date_created,
    }
  },

  // // searches for post by id
  // getById(db, id) {
  //   return db
  //     .from('posts AS pos')
  //     .select(
  //       'pos.id',
  //       'pos.title',
  //       'pos.content',
  //       'pos.date_created',
  //       db.raw(
  //         `row_to_json(
  //           (SELECT tmp FROM (
  //             SELECT
  //               usr.id,
  //               usr.user_name,
  //               usr.email,
  //               usr.date_created,
  //               usr.date_modified
  //           ) tmp)
  //         ) AS "subscriber"`
  //       )
  //     )
  //     .leftJoin(
  //       'subscribers AS usr',
  //       'pos.id',
  //       'usr.id',
  //     )
  //     .where('pos.id', id)
  //     .first()
  // },


  //inserts new posts
  insertPost(db, newPost) {
    console.log(newPost)
    return db
      .insert(newPost)
      .into('posts')
      .returning('*')
      .then(([post]) => { return post })
      .then(post => {
        return PostsService.getById(db, post.id)
      }
      )
  },

  // serializePost(post) {
  //   let post
  //   // converts post(object) to an array of objects
  //   result = Object.values(post).map(elem => { return elem });
  //   return result
  // }
  // ,
  

  serializePostComments(post) {
    return {
      id: post.id,
      image: post.image,
      content: xss(post.content),
      rating: post.rating,
      date_created: post.date_created,
      subscriber: post.subscriber || {},
    }
  },



}

const userFields = [
  'usr.id AS subscriber:id',
  'usr.user_name AS subscriber:user_name',
  'usr.email AS subscriber:email',
  // 'usr.full_name AS user:full_name',
  // 'usr.nickname AS user:nickname',
  'usr.date_created AS subscriber:date_created',
  'usr.date_modified AS subscriber:date_modified',
]

module.exports = PostsService
