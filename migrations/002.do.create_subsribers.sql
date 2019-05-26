CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);

ALTER TABLE posts
  ADD COLUMN
    user_id INTEGER REFERENCES subscribers(id)
    ON DELETE SET NULL;