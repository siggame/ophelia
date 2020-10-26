'use strict'

const express = require('express')
const router = express.Router()
const teams = require('../db/init').teams
const users = require('../db/init').users
const sanitizer = require('../utils/sanitizer')

const path = '/teams'

router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    names: []
  }
  teams.getAllTeamNames().then((data) => {
    response.success = true
    response.names = data
    return res.status(200).json(response)
  })
})

router.get(path + '/:teamName', (req, res, next) => {
  const response = {
    success: false,
    message: '',
    team: null
  }
  const teamName = req.params.teamName
  teams.getTeamByName(teamName).then((team) => {
    if (typeof team === 'undefined' || team === null) {
      response.message = 'That team does not exist'
      res.status(400).json(response)
    }
    response.success = true
    response.message = 'Team retrieved successfully'
    response.team = {
      id: team.id,
      name: team.name,
      eligible: team.is_eligible,
      paid: team.is_paid,
      closed: team.is_closed,
      captainId: team.team_captain_id
    }
    return res.status(200).json(response)
  }).catch((err) => {
    next(err)
  })
})

router.get(path + '/id/:teamId', (req, res, next) => {
  const response = {
    success: false,
    team: null
  }
  const teamId = req.params.teamId
  teams.getTeam(teamId).then((team) => {
    if (typeof team === 'undefined' || team === null) {
      response.message = 'That team does not exist'
      res.status(400).json(response)
    }
    response.success = true
    response.message = 'Team retrieved successfully'
    response.team = {
      id: team.id,
      name: team.name,
      eligible: team.is_eligible,
      paid: team.is_paid,
      closed: team.is_closed,
      captainId: team.team_captain_id
    }
    return res.status(200).json(response)
  }).catch((err) => {
    next(err)
  })
})

router.post(path + '/', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  const body = req.body
  const requiredValues = ['name']
  for (const value of requiredValues) {
    if (typeof body[value] === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    }
  }
  const name = body.name
  const teamCaptainId = req.user.id
  if (!sanitizer.isValidTeamName(name)) {
    response.message = 'Invalid team name'
    return res.status(400).json(response)
  }
  teams.createTeam(name, teamCaptainId).then(() => {
    response.success = true
    response.message = 'Created team successfully'
    return res.status(201).json(response)
  }).catch((err) => {
    if (err.message === teams.DUPLICATE_NAME_MESSAGE || err.message === teams.ALREADY_A_CAPTAIN || err.message === teams.NO_SUCH_USER) {
      response.message = err.message
      return res.status(400).json(response)
    }
    throw err
  }).catch((err) => {
    return next(err)
  })
})

router.delete(path + '/:username', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  const username = req.params.username
  users.getUserByName(username).then((user) => {
    const urlUserId = user.id
    const userId = req.user.id
    users.isUserTeamCaptain(userId).then((result) => {
      if (result === true) {
        if (userId !== urlUserId) {
          teams.removeUserFromTeam(urlUserId).then(() => {
            response.success = true
            response.message = 'Successfully removed user from team'
            return res.status(200).json(response)
          }).catch((err) => {
            next(err)
          })
        } else if (userId === urlUserId) {
          // Put disbanding team here if userId and urlUserId are equal?
          users.getUsersTeam(userId).then((teamName) => {
            teams.deleteTeam(teamName).then(() => {
              response.message = 'Successfully deleted team ' + teamName
              return res.status(200).json(response)
            }).catch((err) => {
              next(err)
            }).catch((err) => {
              next(err)
            })
          })
        }
      } else if (result === false) {
        if (userId !== urlUserId) {
          response.message = 'You do not have permissions to remove users from this team'
          return res.status(400).json(response)
        } else if (userId === urlUserId) {
          teams.removeUserFromTeam(urlUserId).then(() => {
            response.success = true
            response.message = 'Successfully left the team'
            return res.status(200).json(response)
          }).catch((err) => {
            next(err)
          })
        }
      }
    })
  })
})

module.exports = {router}
