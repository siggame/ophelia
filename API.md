# API
Information about the web server's REST API.
**CURRENTLY ANYTHING IN HERE IS SUBJECT TO CHANGE**

## Users

`GET /users/`

Returns a list of all the users.

`GET /users/:userId`

Returns a user with specified userId.

`POST /users/`

Creates a new user.

Request Body Format:
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
Request Body Format:
```
{
    name: String,
    email: String,
    password: String,
    contactName: String,
    bio: String,
}
```

## Teams

`GET /teams/`

Returns a list of all the teams.

`GET /teams/:teamName`

Returns the team with the specified team name.

`POST /teams/`

Creates a team named what was sent in the request body. The user making this request is automatically made the team captain.

Request Body Format:
```
{
    name: String
}
```

## Login

`POST /login/`

Attempts to log in with specified username and password in request body. Returns a JWT for the user if the login is successful.

Request Body Format:
```
{
    username: String,
    password: String
}
```

## Invites

`GET /invites/teams/:teamId`

Returns a list of invites for the specified team.

`GET /invites/user/:userId`

Returns a list of invites for the specified user.

`POST /invites/`

Creates an invite for a user from a team.

Request Body Format:
```
{
    teamName: String,
    userId: Int
}
```

## Games

`POST /games/`

Record a game in the database. Winner id is the id of the submission that won.

Request Body Format:
```
{
    status: String in ['queued', 'playing', 'finished', 'failed']
    winReason: String,
    loseReason: String,
    winnerId: Int,
    logUrl: String
}
```
