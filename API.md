# API
Information about the web server's REST API

## Users

`GET /users/`

Returns a list of all the users.

`GET /users/:userId`

Returns a user with specified userId.

`POST /users/`

Creates a new user.

Request body format:
```
{
   name: String,
   email: String,
   password: String,
   contactName: String
}
```

`PUT /users/`

Updates the current users information. Can only be called if the user has a JWT.
Request body format:
```
{
    name: String,
    email: String,
    password: String,
    contactName: String,
    bio: String,
}
```

