# API
Information about the web server's REST API

## Users

`GET /users/`

Gets all users
Response body format:
{
   success: boolean,
   names: list
}
Response codes:
200 - got all users successfully
500 - something went wrong


`POST /users/`

Creates a new user
Request body format:
{
   name: String,
   email: String,
   password: String,
   contactName: String
}
Response body format:
{
   success: boolean,
   message: String
}
Response codes:
201 - User created successfully
400 - Bad request
500 - Something went wrong