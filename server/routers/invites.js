'use strict'

const express = require('express')
const router = express.Router()
const invites = require('../db/init').invites

const path = '/invites'

/**
 * Get invites for a team
 */
router.get(path + '/teams/:teamId', (req, res) => {
  const response = {
    success: false,
    invites: []
  }
  const teamId = req.params.teamId
  invites.getInvitesForTeam(teamId).then((invites) => {
    response.invites = invites
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    return res.status(500).json(err)
  })
})

/**
 * Get invites for a user
 */
router.get(path + '/users/:userId', (req, res) => {
  const response = {
    success: false,
    invites: []
  }
  const userId = req.params.userId
  invites.getInvitesForUser(userId).then((invites) => {
    response.invites = invites
    response.success = true
    return res.status(200).json(response)
  }).catch((err) => {
    return res.status(500).json(err)
  })
})

/**
 * Invite user to a team
 * {
 *   teamName: team1
 *   userId : 1
 * }
 */
router.post(path + '/', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const userId = req.body.userId
  const teamName = req.body.teamName
  invites.createInvite(teamName, userId).then(() => {
    response.success = true
    response.message = 'Successfully invited user to team'
    return res.status(200).json(response)
  }).catch(() => {
    return res.status(500)
  })
})

module.exports = {router}
