const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeSubscribersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makePostsArray(subscribers) {
  return [
    {
      id: 1,
      title: 'First test thing!',
      image: 'http://placehold.it/500x500',
      user_id: subscribers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 2,
      title: 'Second test thing!',
      image: 'http://placehold.it/500x500',
      user_id: subscribers[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 3,
      title: 'Third test thing!',
      image: 'http://placehold.it/500x500',
      user_id: subscribers[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 4,
      title: 'Fourth test thing!',
      image: 'http://placehold.it/500x500',
      user_id: subscribers[3].id,
      date_created: '2029-01-22T16:28:32.615Z',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
  ]
}

function makeReviewsArray(subscribers, things) {
  return [
    {
      id: 1,
      rating: 2,
      text: 'First test review!',
      thing_id: things[0].id,
      user_id: subscribers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      rating: 3,
      text: 'Second test review!',
      thing_id: things[0].id,
      user_id: subscribers[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      rating: 1,
      text: 'Third test review!',
      thing_id: things[0].id,
      user_id: subscribers[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      rating: 5,
      text: 'Fourth test review!',
      thing_id: things[0].id,
      user_id: subscribers[3].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 5,
      rating: 1,
      text: 'Fifth test review!',
      thing_id: things[things.length - 1].id,
      user_id: subscribers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 6,
      rating: 2,
      text: 'Sixth test review!',
      thing_id: things[things.length - 1].id,
      user_id: subscribers[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 7,
      rating: 5,
      text: 'Seventh test review!',
      thing_id: things[3].id,
      user_id: subscribers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeExpectedThing(subscribers, thing, reviews=[]) {
  const user = subscribers
    .find(user => user.id === thing.user_id)

  const thingReviews = reviews
    .filter(review => review.thing_id === thing.id)

  const number_of_reviews = thingReviews.length
  const average_review_rating = calculateAverageReviewRating(thingReviews)

  return {
    id: thing.id,
    image: thing.image,
    title: thing.title,
    content: thing.content,
    date_created: thing.date_created,
    number_of_reviews,
    average_review_rating,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: user.date_created,
    },
  }
}

function calculateAverageReviewRating(reviews) {
  if(!reviews.length) return 0

  const sum = reviews
    .map(review => review.rating)
    .reduce((a, b) => a + b)

  return Math.round(sum / reviews.length)
}

function makeExpectedThingReviews(subscribers, thingId, reviews) {
  const expectedReviews = reviews
    .filter(review => review.thing_id === thingId)

  return expectedReviews.map(review => {
    const reviewUser = subscribers.find(user => user.id === review.user_id)
    return {
      id: review.id,
      text: review.text,
      rating: review.rating,
      date_created: review.date_created,
      user: {
        id: reviewUser.id,
        user_name: reviewUser.user_name,
        full_name: reviewUser.full_name,
        nickname: reviewUser.nickname,
        date_created: reviewUser.date_created,
      }
    }
  })
}

function makeMaliciousThing(user) {
  const maliciousThing = {
    id: 911,
    image: 'http://placehold.it/500x500',
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    subscriber_id: subscriber.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedPost = {
    ...makeExpectedThing([subscriber], maliciousPost),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousPost,
    expectedPost,
  }
}

function makePostsFixtures() {
  const testSubscribers = makeSubscribersArray()
  const testPosts = makePostsArray(testSubscribers)
  const testReviews = makeReviewsArray(testSubscribers, testPosts)
  return { testSubscribers, testPosts, testReviews }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      posts,
      subscribers,
      comments
      RESTART IDENTITY CASCADE`
  )
  // //experimental
  // .then(() => 
  //   Promise.all([
  //     trx.raw('ALTER SEQUENCE thingful_users_id_seq minvalue 0 START WITH 1'),
  //     trx.raw(`SELECT setval('thingful_users_id_seq', 0)`),
  //   ])
  // )
}

function seedSubscribers(db, subscribers) {
  const preppedUsers = subscribers.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('subscribers').insert(preppedUsers)
    .then(() => 
      db.raw(
        `SELECT setval('thingful_users_id_seq', ?)`,
        [subscribers[subscribers.length - 1 ].id],
      )
    )
}

function seedPostsTables(db, subscribers, posts, comments=[]) {
  return seedSubscribers(db, subscribers)
    .then(() =>
      db
        .into('posts')
        .insert(posts)
    )
    .then(() =>
      comments.length && db.into('comments').insert(comments)
    )
}

function seedMaliciousPost(db, user, thing) {
  return seedSubscribers(db, [user])
    .then(() =>
      db
        .into('posts')
        .insert([post])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}



module.exports = {
  makeSubscribersArray,
  makePostsArray,
  makeExpectedThing,
  makeExpectedThingReviews,
  makeMaliciousThing,
  makeReviewsArray,

  makePostsFixtures,
  cleanTables,
  seedPostsTables,
  seedMaliciousPost,
  makeAuthHeader,
  seedSubscribers
}
