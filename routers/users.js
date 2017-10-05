'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

// All paths in this file should start with this
const path = '/users'

router.get(path + '/', (req, res) => {

})

router.post(path + '/', (req, res) => {
  const userData = req.body
  // TODO: encrypt passwords
  teams.createTeam(userData.name, userData.contactEmail, userData.password, true).then(() => {
    res.send({
      success: true,
      message: 'Created user successfully'
    })
  }).catch((err) => {
    res.send({
      success: false,
      message: err
    })
  })
})

router.get(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

router.put(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
