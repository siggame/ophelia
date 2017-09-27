'use strict'

const express = require('express')
const validate = require('../session/validate')
const db = require('../db/init')
const router = express.Router()

// Handle GET requests for the Login page
router.get('/dashboard', validate.requireLogin, (req, res) => {
  db.teams.getTeamByName(req.session.user).then((data) => {
    console.log(data)
    res.render('dashboard', {
      title: 'MegaminerAI - Your Dashboard',
      user: req.session.user,
      teamInfo: data[0]
    })
  }).catch((err) => {
    console.log(err)
    res.redirect('/500')
  })
})

module.exports = {router}
