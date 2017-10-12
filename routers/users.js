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
    user: null

  }

  db.teams.getTeamByName(req.params.teamName).then((data) => {
    response.success = true
    response.message = 'Success'
    response.user = {
      name: data[0].name,
      contactEmail: data[0].contact_email,
      isEligible: data[0].is_eligible
    }

    res.status(200).json(response)
  }, (err) => {
    response.message = 'User does not have access to this information.'
    response.user = null  // outputs to postman
    res.status(401).json(response)
  }).catch((err) => {
    response.success = false
    response.message = 'Team does not exist.'
    res.status(404).json(response)
  })
})

router.put(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
