const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db
      .from('comments AS rev')
      .select(
        'rev.id',
        'rev.text',
        'rev.date_created',
        'rev.post_id',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.date_created,
                usr.date_modified
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin(
        'subscribers AS usr',
        'rev.subscriber_id',
        'usr.id',
      )
      .where('rev.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
      )
  },

  serializeComment(comment) {
    return {
      id: comment.id,
      text: xss(comment.text),
      post_id: comment.post_id,
      date_created: comment.date_created,
      subscriber: comment.subscriber || {},
    }
  }
}

module.exports = CommentsService
