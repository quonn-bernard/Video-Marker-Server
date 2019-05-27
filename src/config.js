'use strict';

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  TEST_DB_URL: process.env.DATABASE_URL || 'postgresql://quonn@localhost/blog_db',
  DB_URL: process.env.DATABASE_URL || 'postgresql://quonn@localhost/blog_db',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '6000ms',
  API_ENDPOINT: `https://protected-tundra-30619.herokuapp.com/`,
  API_KEY: process.env.REACT_APP_API_KEY,
};
