'use strict'

const express = require('express')
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')
// const jwt = require('express-jwt')
const db = require('../db/init')
const compare = require('../session/auth').compare

// These need to be in a config/.env file
const tokenSecret = 'temporarySecret'
const expired = '1d' // expires in 1 day

// All paths in this file should start with this
const path = '/signin'

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
    if (typeof team.password === 'undefined') {
      status = 500
      response.message = 'There was a problem retrieving data from the db'
      response.success = false
    } else {
      const encryptedPassword = team.password
      const salt = team.salt
      const iterations = team.hash_iterations
      const role = team.role
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
  response.message = err
  res.status(status).json(response)
}

module.exports = {router}
