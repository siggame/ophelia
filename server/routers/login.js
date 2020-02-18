'use strict'

const express = require('express')
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const login = require('../session/login').login
const sanitizer = require('../utils/sanitizer')

const tokenSecret = require('../vars').TOKEN_SECRET
const expired = require('../vars').TOKEN_EXPIRE_TIME

// All paths in this file should start with this
const path = '/login'

/**
 * Expects a body with the form:
 * {
 *    username: String,
 *    password: String
 * }
 * Responds with a body of the form:
 * {
 *    success: Boolean,
 *    message: String,
 *    token: String
 * }
 * where the token field is the Json Web Token created for that user's session
 * Response codes:
 * 200 Successfully logged in
 * 400 Bad input, missing fields
 * 401 Unauthorized, incorrect username or password
 * 500 Server error
 */
router.post(path + '/', (req, res, next) => {
  const body = req.body
  let response = {
    success: false,
    message: '',
    token: null
  }
  const requiredValues = ['username', 'password']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      // Raven.captureException("The error i want to record", { req: req })
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const username = body.username
  const password = body.password
  if (!sanitizer.isValidUsername(username)) {
    // raven.captureException("incorrect login password")
    response.message = 'Bad username'
    return res.status(400).json(response)
  }
  if (!sanitizer.isValidPassword(password)) {
    response.message = 'Incorrect password'
    return res.status(400).json(response)
  }
  login(username, password).then((result) => {
    if (result === false || result === null) {
      // If result is false then they gave the wrong username or password
      // If the result is null then they must not exist in the db
      response.success = false
      response.message = 'Incorrect password';
      return res.status(401).json(response)
    }
    const token = jsonwebtoken.sign({
      username: username,
      id: result.id,
      role: result.role
    }, tokenSecret, {
      expiresIn: expired
    })
    response.success = true
    response.token = token
    return res.status(200).json(response)
  }, (err) => {
    return next(err)
  }).catch((err) => {
    return next(err)
  })
})

module.exports = {router}
