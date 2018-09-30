'use strict'

const express = require('express')
const router = express.Router()
const users = require('../db/init').users
const encrypt = require('../session/auth').encrypt
const login = require('../session/login').login
const sanitizer = require('../utils/sanitizer')
const ELIGIBLE_DEFAULT = require('../vars').ELIGIBLE_DEFAULT

const path = '/users'

/**
 * Gets all users
 * Response body format:
 * {
 *    success: boolean,
 *    names: list
 * }
 * Response codes:
 * 200 - got all users successfully
 * 500 - something went wrong
 */

router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    names: []
  }
  users.getAllUsernames().then((data) => {
    response.success = true
    response.names = data
    return res.status(200).json(response)
  })
})

/**
 * Creates a new user
 * Request body format:
 * {
 *    name: String,
 *    email: String,
 *    password: String,
 *    contactName: String
 * }
 * Response body format:
 * {
 *    success: boolean,
 *    message: String
 * }
 * Response codes:
 * 201 - User created successfully
 * 400 - Bad request
 * 500 - Something went wrong
 */

router.post(path + '/', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }

  const body = req.body

  const requiredValues = ['name', 'email', 'password', 'contactName']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }

  const name = body.name
  const password = body.password
  const email = body.email
  const contactName = body.contactName

  // sanitize inputs
  if (!sanitizer.isValidUsername(name)) {
    response.message = 'Not an acceptable username.'
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
  if (!sanitizer.isValidUsername(name)) {
    response.message = 'Not an acceptable name.'
    return res.status(400).json(response)
  }
  const passInfo = encrypt(body.password)
  const role = 'user'
  users.createUser(
    name,
    email,
    passInfo.epass,
    passInfo.salt,
    passInfo.iterations,
    role,
    contactName
  ).then(() => {
    response.success = true
    response.message = 'Created user successfully'
    res.status(201).json(response)
  }).catch((err) => {
    if (err.message === users.DUPLICATE_NAME_MESSAGE || err.message === users.DUPLICATE_EMAIL_MESSAGE ||
      err.message === users.MISSING_FIELD_MESSAGE) {
      response.message = err.message
      return res.status(400).json(response)
    }
    // Throw any other errors, these are server related errors and are handled below
    throw err
  }).catch((err) => {
    return next(err)
  })
})

/**
 * Gets a user by their ID
 * Response body format:
 * {
 *    success: boolean,
 *    message: String,
 *    user: User
 * }
 * Response codes:
 * 200 - Retrieved user successfully
 * 400 - Bad request
 * 500 - Something went wrong
 */
router.get(path + '/:userId', (req, res, next) => {
  const response = {
    success: false,
    message: '',
    user: null
  }
  const userId = req.params.userId
  users.getUser(userId).then((user) => {
    if (typeof user === 'undefined' || user === null) {
      response.success = false
      response.message = 'This user does not exist'
      return res.status(400).json(response)
    }
    response.success = true
    response.message = 'User retrieved successfully'
    response.user = {
      name: user.name,
      email: user.email,
      contactName: user.contact_name
    }
    return res.status(200).json(response)
  }).catch((err) => {
    next(err)
  })
})

router.put(path + '/', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  const dataToUpdate = {}
  const body = req.body
  const userId = req.user.id
  const updateableValues = ['name', 'contactName', 'password', 'email', 'bio', 'profilePic', 'active']
  for (const value of updateableValues) {
    if (typeof body[value] !== 'undefined') {
      console.log(value)
      switch (value) {
        case 'name':
          if (!sanitizer.isValidUsername(body[value])) {
            response.message = 'Not a valid username'
            return res.status(400).json(response)
          }
          dataToUpdate.name = body[value]
          break
        case 'contactName':
          if (!sanitizer.isValidUsername(body[value])) {
            response.message = 'Not a valid username'
            return res.status(400).json(response)
          }
          dataToUpdate.contact_name = body[value]
          break
        case 'password':
          if (!sanitizer.isValidPassword(body[value])) {
            response.message = 'Not a valid password'
            return res.status(400).json(response)
          }
          const passInfo = encrypt(body[value])
          dataToUpdate.password = passInfo.epass
          dataToUpdate.hash_iterations = passInfo.iterations
          dataToUpdate.salt = passInfo.salt
          break
        case 'email':
          if (!sanitizer.isValidEmail(body[value])) {
            response.message = 'Not a valid email'
            return res.status(400).json(response)
          }
          dataToUpdate.email = body[value]
          break
        case 'bio':
          dataToUpdate.bio = body[value]
          break
        case 'profilePic':
          break
      }
    }
  }
  users.editUser(userId, dataToUpdate).then(() => {
    response.success = true
    response.message = 'User successfully updated'
    return res.status(200).json(response)
  }).catch((err) => {
    next(err)
  })
})

module.exports = {router}
