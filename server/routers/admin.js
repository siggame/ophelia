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
    } else {
      response.message = 'forbidden'
      return res.status(403).json(response)
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
 *     }
 * }
 * Where each of the fields in editData is optional, but at least one must exist
 */
router.put(path + '/users/:teamName', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  // These are the fields that can be edited for a user.
  const editableFields = ['is_eligible']
  const teamName = req.params.teamName
  const userId = req.user.id
  const body = req.body
  teams.isUserAdmin(userId)
  // If these values aren't here then we can't move forward.
  const requiredValues = ['editData']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const editData = body.editData

  // Use the login function to check if they are signed in properly
  teams.isUserAdmin(userId).then((result) => {
    // user.success determines whether or not the user successfully logged in
    if (result) {
      // This will hold all of the data to be edited
      const teamEditData = {}
      // Iterate over each of the fields allowed to be edited
      for (const field of editableFields) {
        if (editData.hasOwnProperty(field)) {
          switch (field) {
            case 'is_eligible':
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
        response.message = 'Edited user successfully'
        res.status(200).json(response)
      }, (err) => {
        next(err)
      }).catch((err) => {
        next(err)
      })
    } else {
      response.message = 'forbidden'
      return res.status(403).json(response)
    }
  }, (err) => {
    next(err)
  }).catch((err) => {
    next(err)
  })
})

module.exports = {router}
