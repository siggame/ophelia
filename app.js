'use strict'

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const multer = require('multer')
const upload = multer()
require('dotenv').config()

const routers = require('./routers/init')

const app = express()

// view engine setup
app.set('components', path.join(__dirname, 'components'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: 'testsecrethaha',
  resave: 'false',
  saveUninitialized: 'true'
}))
app.use(express.static(path.join(__dirname, 'public')))

// Tell Express to use our routers we've made.
app.use('/', routers.users.router)
app.use('/', routers.submissions.router)
app.use('/', routers.games.router)
app.use('/', routers.signIn.router)
app.use('/', routers.medium.router)

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

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// for parsing application/json
app.use(bodyParser.json())

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))

// for parsing multipart/form-data
app.use(upload.array())
app.use(express.static('public'))

module.exports = app
