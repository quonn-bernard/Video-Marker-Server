# V-Marker-Server
Express.js server, that serves V-Marker-Client

[V-MarkerClient](https://github.com/quonn-bernard/Video-Marker-Client)
## API Documentation
[Youtube Data API](https://developers.google.com/youtube/v3/)
### Server Endpoints

GET /api/posts/    --> get all posts

GET /api/posts/:post_id    --> get post by id

POST /api/posts/    --> Inserts posts into posts table

POST /api/auth/login    --> authenticates users

POST /api/subscribers/    --> registers new users
