'use strict'

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const multer = require('multer')
const upload = multer()
const fileUpload = require('express-fileupload')
const cors = require('cors')
require('dotenv').config()
const maxFileSize = require('./vars').MAX_FILE_SIZE
const jwtSecret = require('./vars').TOKEN_SECRET
const hostname = require('./vars').HOST
const raven = require('./utils/ravenconfig')

const routers = require('./routers/init')

const app = express()

// Enable CORS for the hostname that the client is hosted at
app.use(cors({origin: hostname}))
app.options(cors({origin: hostname}))
// view engine setup
app.set('components', path.join(__dirname, 'components'))

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// allows file uploads up to a max size of 512 KB
app.use(fileUpload({
  limits: { fileSize: maxFileSize }
}))

// Add JSON Web Token functionality
const jwtConfig = {
  secret: jwtSecret
}
const usersPath = {
  url: '/users',
  methods: ['GET', 'POST']
}
const usersPath2 = {
  url: '/users/',
  methods: ['GET', 'POST']
}
const unsecuredPaths = [/\/login\/?/, usersPath, usersPath2]
const unlessConfig = {
  path: unsecuredPaths
}
app.use('/', jwt(jwtConfig).unless(unlessConfig))

// Tell Express to use our routers we've made.
app.use('/', routers.users.router)
app.use('/', routers.submissions.router)
app.use('/', routers.games.router)
app.use('/', routers.login.router)
app.use('/', routers.medium.router)

// Error handler for missing jwt
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    const response = {
      success: false,
      message: 'unauthorized'
    }
    return res.status(401).json(response)
  }
  next(err)
})

app.use(function (err, req, res, next) {
  err.status = 500
  const context = {
    user: req.user,
    params: req.params,
    body: req.body,
    query: req.query,
    req: req
  }
  raven.error(err, context)
  next(err)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  const response = {
    success: false,
    message: ''
  }
  if (req.app.get('env') === 'development') {
    response.message = 'An error occurred: ' + err.message
  }
  return res.status(err.status || 500).json(response)
})

// for parsing application/json
app.use(bodyParser.json())

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))

// for parsing multipart/form-data
app.use(upload.array())
app.use(express.static('public'))

module.exports = app
