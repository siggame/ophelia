const express = require('express')
const router = express.Router()
const teams = require('../db/init').teams

// All paths in this file should start with this
const path = '/admin'

/**
 * Gets a list of all users
 * Response body format:
 * {
*     Success: Boolean,
*     users: [users Object]
* }
 * Response codes:
 * 200 - Successfully retrieved
 * 500 - Something went wrong
 */
router.get(path + '/users', (req, res, next) => {
  const response = {
    success: false,
    message: '',
    users: []
  }
  const userId = req.user.id
  teams.isUserAdmin(userId).then((result) => {
    if (result) {
      teams.getAllTeams().then((data) => {
        response.success = true
        response.users = data
        return res.status(200).json(response)
      }).catch((err) => {
        next(err)
      })
    }
    response.message = 'forbidden'
    return res.status(403).json(response)
  }).catch((err) => {
    next(err)
  })
})
