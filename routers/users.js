'use strict'

const express = require('express')
const _ = require('lodash')
const router = express.Router()
const db = require('../db/init')

// All paths in this file should start with this
const path = '/users'

router.get(path + '/', (req, res) => {

})

/**
 * Creates a user
 * Request body format:
 * {
*     username: String,
*     password: String,
*     email: String
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
  const userData = req.body
  // Checking for required values
  if(!userData.username) {
    response.message = 'Required field username is missing or blank'
    res.status(400).json(response)
  } else if(!userData.email) {
    response.message = 'Required field email is missing or blank'
    res.status(400).json(response)
  } else if(!userData.password) {
    response.message = 'Required field password is missing or blank'
    res.status(400).json(response)
  }
  // TODO: encrypt passwords
  db.teams.createTeam(userData.username, userData.email, userData.password, true).then(() => {
    response.success = true
    response.message = 'Created user successfully'
    res.status(201).json(response)
  }, (err) => {
    response.message = err.message
    res.status(400).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(400).json(response)
  })
})

router.get(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

router.put(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
