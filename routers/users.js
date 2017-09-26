const express = require('express')
const router = express.Router()
const teams = require('../db/teams')

router.get('/users', (req, res) => {
  teams.getAllTeamNames().then((result) => {
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

module.exports = { router }
