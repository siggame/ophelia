'use strict'

const express = require('express')
const router = express.Router()
const teams = require('../db/init').teams
const encrypt = require('../session/auth').encrypt
const login = require('../session/login').login
const sanitizer = require('../utils/sanitizer')

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
  const username = body.username
  const password = body.password
  const email = body.email
  const name = body.name

  // sanitizing the inputs
  if (!sanitizer.isValidUsername(username)) {
    response.message = 'Team name is already in use.'
    return res.status(400).json(response)
  }
  if (!sanitizer.isValidPassword(password)) {
    response.message = 'Password does not meet requirements.'
    return res.status(400).json(response)
  }
  if (!sanitizer.isValidEmail(email)) {
    response.message = 'Email is invalid or already in use.'
    return res.status(400).json(response)
  }
  const passInfo = encrypt(body.password)
  teams.createTeam(
    username,
    email,
    passInfo.epass,
    passInfo.salt,
    passInfo.iterations,
    'user',
    name,
    true
  ).then(() => {
    response.success = true
    response.message = 'Created user successfully'
    res.status(201).json(response)
  }).catch((err) => {
    if (err.message === teams.DUPLICATE_NAME_MESSAGE || err.message === teams.DUPLICATE_EMAIL_MESSAGE ||
      err.message === teams.MISSING_FIELD_MESSAGE) {
      response.message = err.message
      return res.status(400).json(response)
    }
    // Throw any other errors, these are server related errors and are handled below
    throw err
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })
})

router.get(path + '/:teamName', (req, res) => {
  const response = {
    success: false,
    message: '',
    user: null

  }
  teams.getTeamByName(req.params.teamName).then((data) => {
    if (data.length === 0) {
      response.success = false
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

/**
 * Edits a user
 * Request body format
 * {
 *     oldPassword: String,
 *     editData: {
 *         email: String,
 *         name: String,
 *         password: String
 *     }
 * }
 * Where each of the fields in editData is optional, but at least one must exist
 */
router.put(path + '/:teamName', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  // These are the fields that can be edited for a user.
  const editableFields = ['email', 'name', 'password']
  const teamName = req.params.teamName
  const jwtTeamName = req.user.username
  const body = req.body
  if (teamName !== jwtTeamName) {
    response.message = 'forbidden'
    return res.status(403).json(response)
  }
  // If these values aren't here then we can't move forward.
  const requiredValues = ['oldPassword', 'editData']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const oldPassword = body.oldPassword
  const editData = body.editData

  // Use the login function to check if they are signed in properly
  login(teamName, oldPassword).then((user) => {
    // user.success determines whether or not the user successfully logged in
    if (user.success) {
      // This will hold all of the data to be edited
      const teamEditData = {}
      // Iterate over each of the fields allowed to be edited
      for (const field in editData) {
        if (editData.hasOwnProperty(field)) {
          if (editableFields.indexOf(field) === -1) {
            response.message = 'Editable fields include only: ' + editableFields
            return res.status(400).json(response)
          }
          switch (field) {
            case 'password':
              if (!sanitizer.isValidPassword(editableFields[field])) {
                response.message = 'Password does not meet requirements.'
                return res.status(400).json(response)
              }
              // If the field is 'password' then we need to run encrypt to
              // get the proper information
              teamEditData[field] = encrypt(editData.password)
              break
            case 'email':
              if (!sanitizer.isValidEmail(editableFields[field])) {
                response.message = 'Email is invalid or already in use.'
                return res.status(400).json(response)
              }
              teamEditData[field] = editableFields[field]
              break
            default:
              teamEditData[field] = editableFields[field]
          }
        }
      }
      // If the object has no keys then there were no valid keys given
      if (Object.keys(teamEditData).length === 0) {
        response.message = 'Editable fields include only: ' + editableFields
        return res.status(400).json(response)
      }
      teams.editTeam(teamName, teamEditData).then(() => {
        response.success = true
        response.message = 'Edited user successfully'
        res.status(200).json(response)
      }, (err) => {
        response.message = err.message
        res.status(500).json(response)
      }).catch((err) => {
        response.message = err.message
        res.status(500).json(response)
      })
    } else {
      response.message = 'unauthorized'
      return res.status(401).json(response)
    }
  }, (err) => {
    console.log(err)
    res.status(500).json(response)
  }).catch((err) => {
    console.log(err)
    res.status(500).json(response)
  })
})

module.exports = {router}
