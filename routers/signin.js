'use strict'

const express = require('express')
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')
// const jwt = require('express-jwt')
const db = require('../db/init')

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
  if (typeof body.teamName === 'undefined' ||
    typeof body.password === 'undefined') {
    status = 400
    response.success = false
    res.status(status).send(response)
  } else {
    const teamName = body.teamName
    const password = body.password
    db.teams.getTeamByName(teamName).then((team) => {
      console.log(team)
      if (typeof team.password === 'undefined') {
        status = 500
        response.message = 'There was a problem retrieving data from the db'
        response.success = false
      } else {
        // This won't actually work, need to run through same encrpytion/hash
        // that was used on account creation
        if (password === team.password) {
          const token = jsonwebtoken.sign({
            username: teamName
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
      res.status(status).json(response)
    }, signInErrorHandler.bind(null, res))
      .catch(signInErrorHandler.bind(null, res))
  }
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
