'use strict'

const express = require('express')
// const _ = require('lodash')
const router = express.Router()
const teams = require('../db/init').teams
const encrypt = require('../session/auth').encrypt
const login = require('../session/login').login

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

  teams.getAllTeamNames().then((data) => {
    response.success = true
    response.users = data
    res.status(200).json(response)
  }, (err) => {
    res.status(500).json(response)
  }).catch(() => {
    res.status(500).json(response)
  })
})

/**
 * Creates a user
 * Request body format:
 * {
*     username: String,
*     password: String,
*     email: String,
*     name: String
* }
 * Response body format:
 * {
*     success: Boolean, - true if success, false otherwise
*     message: String - error message/success message
* }
 * Response codes:
 * 201 - Successfully created
 * 400 - User error
 * 500 - Something went wrong
 */
router.post(path + '/', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const body = req.body
  // Checking for required values
  const requiredValues = ['username', 'email', 'password', 'name']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const passInfo = encrypt(body.password)
  teams.createTeam(
    body.username,
    body.email,
    passInfo.epass,
    passInfo.salt,
    passInfo.iterations,
    'user',
    body.name,
    true
  ).then(() => {
    response.success = true
    response.message = 'Created user successfully'
    res.status(201).json(response)
  }, (err) => {
    response.message = err.message
    res.status(400).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(400).json(response)
  })
})

router.get(path + '/:teamName', (req, res) => {
  const response = {
    success: false,
    message: '',
    user: null

  }
  // TODO check if user is authorized
  teams.getTeamByName(req.params.teamName).then((data) => {
    if (data.length === 0) {
      response.success = false;
      response.message = 'This team does not exist'
      return res.status(404).json(response)
    }
    response.success = true
    response.message = 'Success'
    response.user = {
      name: data[0].name,
      contactEmail: data[0].contact_email,
      isEligible: data[0].is_eligible
    }

    return res.status(200).json(response)
  }, (err) => {
    response.success = false
    response.message = err.message
    return res.status(500).json(response)
  }).catch((err) => {
    response.success = false
    response.message = err.message
    return res.status(500).json(response)
  })
})

router.put(path + '/:teamName', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const teamName = req.param.teamName
  const body = req.body
  let data = {
    'contact_email': req.body['contactEmail'],
    'password': req.body['password']
  }
  login(teamName, body.password).then((user) => {
    if (user.success) {
      const teamEditData = {}
      if (body.hasOwnProperty('contactEmail')) {
        teamEditData.contact_email = body.contactEmail
      }
      if (body.hasOwnProperty('password')) {
        teamEditData.password = body.password
      }
      teams.editTeam(data).then((result) =>{
        response.success = true
        response.message = 'Edited user successfully'
        res.status(200).json(response)
      },(err) => {
        response.message = err.message
        res.status(400).json(response)
      }).catch((err) => {
        response.message = err.message
        res.status(500).json(response)
      })
    }
  })
})

module.exports = {router}
