'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

// All paths in this file should start with this
const path = '/users'

router.get(path + '/', (req, res) => {

})

/**
 * POST /users/
 * Creates a user.
 * Requires a username, email, and password.
 * Object response:
 * @param success - bool, indicates whether request succeeded
 * @param message - string, gives error reason or success message
 */
router.post(path + '/', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const userData = req.body
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
