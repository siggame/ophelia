'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

// All paths in this file should start with this
const path = '/users'

router.get(path + '/', (req, res) => {
  db.teams.getAllTeamNames().then((result) => {
    res.send({
      success: true,
      users: result
    })
  }).catch(() => {
    // TODO: Send the error back to give context
    res.send({
      success: false,
      users: []
    })
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
