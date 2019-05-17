CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  image TEXT,
  title TEXT NOT NULL,
  content TEXT,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  subscriber_id INTEGER
      REFERENCES subscribers(id) ON DELETE CASCADE NOT NULL
);

