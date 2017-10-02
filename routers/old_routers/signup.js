'use strict'

const express = require('express')
const router = express.Router()
const signup = require('../../session/signup')

// Handle GET requests for the Sign Up page
router.get('/signup', (req, res) => {
  if (req.session.user) {
    // If a user is logged in, they shouldn't need to signup
    res.redirect('/')
  } else {
    res.render('signup', {title: 'MegaminerAI - Sign Up', errorObject: {}})
  }
})

router.post('/signup', (req, res) => {
  let formData = req.body
  console.log('formData', formData)
  let errorObject = {}
  signup.signup(formData.group_name, formData.password, formData.password_confirm, formData.name, formData.email, true).then((success) => {
    console.log('success', success)
    res.redirect('/')
  }, (err) => {
    // TODO: Proper error handling
    console.log('something wrong', err)
    res.render('signup', {title: 'MegaminerAI - Sign Up', errorObject: err})
  })
})

module.exports = {router}
