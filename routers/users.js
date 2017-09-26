const express = require('express')
const router = express.Router()
const teams = require('../db/teams')

router.post('/users', (req, res) => {
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

module.exports = { router }
