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
router.post(path + '/', (req, res) => {
  const body = req.body
  let status = null
  let response = {
    success: null,
    message: '',
    token: null
  }
  const requiredValues = ['username', 'password']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const username = body.username
  const password = body.password
  if (!sanitizer.isValidUsername(username)) {
    response.message = 'Bad username'
    return res.status(400).json(response)
  }
  if (!sanitizer.isValidPassword(password)) {
    response.message = 'Bad password'
    return res.status(400).json(response)
  }
  login(username, password).then((result) => {
    console.log(result)
    if (result.success) {
      const token = jsonwebtoken.sign({
        username: username,
        role: result.role
      }, tokenSecret, {
        expiresIn: expired
      })
      status = 200
      response.success = true
      response.token = token
    } else {
      // If success is false then they gave the wrong username or password
      status = 401
      response.success = false
    }
    return res.status(status).json(response)
  }, loginErrorHandler.bind(null, res))
    .catch(loginErrorHandler.bind(null, res))
})

function loginErrorHandler (res, err) {
  const status = 500
  let response = {
    success: null,
    message: '',
    token: null
  }
  response.success = false
  response.message = err.message
  res.status(status).json(response)
}

module.exports = {router}
