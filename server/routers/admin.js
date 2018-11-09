const express = require('express')
const router = express.Router()
const users = require('../db/init').users
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
  users.isUserAdmin(userId).then((result) => {
    if (!result) {
      // The user is not an admin, they are not allowed to access this endpoint
      response.message = 'forbidden'
      return res.status(403).json(response)
    } else {
      users.getAllUsers().then((data) => {
        response.success = true
        response.users = data
        return res.status(200).json(response)
      }).catch((err) => {
        next(err)
      })
    }
  }).catch((err) => {
    next(err)
  })
})

/**
 * Admin endpoint for editing a user
 * Request body format
 * {
 *     editData: {
 *         is_eligible: bool
 *         is_paid: bool
 *     }
 * }
 * Where each of the fields in editData is optional, but at least one must exist
 */
router.put(path + '/teams/:teamName', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  // These are the fields that can be edited for a user.
  const editableFields = ['is_eligible', 'is_paid']
  const teamName = req.params.teamName
  const userId = req.user.id
  const body = req.body
  // If these values aren't here then we can't move forward.
  const requiredValues = ['editData']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const editData = body.editData

  users.isUserAdmin(userId).then((result) => {
    // result contains whether or not the user is an admin
    if (!result) {
      // The user is not an admin, they are not allowed to access this endpoint
      response.message = 'forbidden'
      return res.status(403).json(response)
    } else {
      // This will hold all of the data to be edited
      const teamEditData = {}
      // Iterate over each of the fields in the request
      for (const field in editData) {
        if (editData.hasOwnProperty(field)) {
          if (editableFields.indexOf(field) === -1) {
            response.message = 'Editable fields include only: ' + editableFields
            return res.status(400).json(response)
          }
          switch (field) {
            case 'is_eligible':
              if (typeof editData[field] !== 'boolean') {
                response.message = 'is_eligible needs to be a boolean'
                return res.status(400).json(response)
              }
              teamEditData[field] = editData[field]
              break
            case 'is_paid':
              if (typeof editData[field] !== 'boolean') {
                response.message = 'is_eligible needs to be a boolean'
                return res.status(400).json(response)
              }
              teamEditData[field] = editData[field]
              break
            default:
              teamEditData[field] = editData[field]
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
        response.message = 'Team successfully updated'
        return res.status(200).json(response)
      })
    }
  }, (err) => {
    next(err)
  }).catch((err) => {
    next(err)
  })
})

router.put(path + '/users/:username', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  const userId = req.user.id
  users.isUserAdmin(userId).then((isAdmin) => {
    if (!isAdmin) {
      response.message = 'You are not an admin'
      return res.status(403).json(response)
    } else {
      const username = req.params.username
      const role = 'admin'
      users.editRole(username, role).then(() => {
        response.success = true
        response.message = 'User ' + username + ' is now an admin'
        return res.status(200).json(response)
      }).catch((err) => {
        next(err)
      })
    }
  })
})

module.exports = {router}
