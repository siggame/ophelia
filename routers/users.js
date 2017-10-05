'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

// All paths in this file should start with this
const path = '/users'

router.get(path + '/', (req, res) => {

})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:teamName', (req, res) => {
  const response = {
    success: false,
    message: '',
    user: {
      name: null,
      contactEmail: null,
      isEligible: null
    }
  }
  db.teams.getTeamByName(req.params.teamName).then((data) => {
    response.success = true
    // TODO Needs to actually extract/validate the data
    response.user = data
    res.json(response)
  }, (err) => {
    // TODO Figure out how to properly make this a string?
    response.message = err
    response.user = null
    res.json(response)
  })
  // TODO Needs a .catch() to handle exceptions
})

router.put(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
