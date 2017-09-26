'use strict'

const express = require('express')
const router = express.Router()
const login = require('../session/login')

// Handle GET requests for the Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    // If a user is already logged in, they don't need to login again
    res.redirect('/')
  } else {
    res.render('login', {title: 'MegaminerAI - Log In', user: req.session.user})
  }
})

router.post('/login', (req, res) => {
  let formData = req.body
  login.login(formData.name, formData.password).then((result) => {
    console.log(result)
    req.session.user = formData.name
    res.redirect('/')
  }).catch((failure) => {
    console.log(failure)
    res.redirect('/login')
  })
})

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.locals.user = undefined
  res.redirect('/login')
})

module.exports = {router}
