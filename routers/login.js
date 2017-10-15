'use strict'

const express = require('express')
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const db = require('../db/init')
const compare = require('../session/auth').compare

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
  db.teams.getTeamByName(username).then((team) => {
    if (typeof team === 'undefined') {
      // If the team is undefined then there must not have been a match
      status = 401
      response.message = ''
      response.success = false
    } else {
      const encryptedPassword = team.password
      const salt = team.salt
      const iterations = team.hash_iterations
      const role = team.role
      // Checking to see if given password matches the one in the db
      if (compare(encryptedPassword, password, salt, iterations)) {
        const token = jsonwebtoken.sign({
          username: username,
          role: role
        }, tokenSecret, {
          expiresIn: expired
        })
        status = 200
        response.success = true
        response.token = token
      } else {
        // If compare failed then they must have given the wrong password
        status = 401
        response.success = false
      }
    }
    return res.status(status).json(response)
  }, signInErrorHandler.bind(null, res))
    .catch(signInErrorHandler.bind(null, res))
})

function signInErrorHandler (res, err) {
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
