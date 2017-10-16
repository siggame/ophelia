'use strict'

const express = require('express')
// const _ = require('lodash')
const router = express.Router()
const db = require('../db/init')
const encrypt = require('../session/auth').encrypt

// All paths in this file should start with this
const path = '/users'

/**
 * Gets a list of all usernames
 * Response body format:
 * {
*     Success: Boolean,
*     users: [String]
* }
 * Response codes:
 * 200 - Successfully retrieved
 * 500 - Something went wrong
 */
router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    users: []
  }

  db.teams.getAllTeamNames().then((data) => {
    response.success = true
    response.users = data
    res.status(200).json(response)
  }).catch(() => {
    res.status(500).json(response)
  })
})

/**
 * Creates a user
 * Request body format:
 * {
*     username: String,
*     password: String,
*     email: String,
*     name: String
* }
 * Response body format:
 * {
*     success: Boolean, - true if success, false otherwise
*     message: String - error message/success message
* }
 * Response codes:
 * 201 - Successfully created
 * 400 - User error
 * 500 - Something went wrong
 */
router.post(path + '/', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const body = req.body
  // Checking for required values
  const requiredValues = ['username', 'email', 'password', 'name']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const passInfo = encrypt(body.password)
  db.teams.createTeam(
    body.username,
    body.email,
    passInfo.epass,
    passInfo.salt,
    passInfo.iterations,
    'user',
    body.name,
    true
  ).then(() => {
    response.success = true
    response.message = 'Created user successfully'
    res.status(201).json(response)
  }).catch((err) => {
    if(err.message === db.teams.DUPLICATE_NAME_MESSAGE || err.message === db.teams.DUPLICATE_EMAIL_MESSAGE ||
      err.message === db.teams.MISSING_FIELD_MESSAGE) {
      response.message = err.message
      return res.status(400).json(response)
    }
    // Throw any other errors, these are server related errors and are handled below
    throw err
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})

router.get(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

router.put(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
