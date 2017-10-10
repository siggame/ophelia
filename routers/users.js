'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

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
  }, (err) => {
    res.status(500).json(response)
  }).catch(() => {
    res.status(500).json(response)
  })
})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

router.put(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
