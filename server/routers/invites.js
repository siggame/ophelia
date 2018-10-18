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
 *   teamName: String
 *   username : String
 * }
 */
router.post(path + '/', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const username = req.body.username
  const teamName = req.body.teamName
  invites.createInvite(teamName, username).then(() => {
    response.success = true
    response.message = 'Successfully invited user to team'
    return res.status(200).json(response)
  }).catch((err) => {
    if (err.message === invites.ALREADY_ON_A_TEAM) {
      response.message = err.message
      return res.status(400).json(response)
    }
    return res.status(500).json(response)
  })
})

/**
 * {
 *   inviteId: num,
 *   accepted: boolean
 * }
 */

router.put(path + '/', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const inviteId = req.body.inviteId
  const accepted = req.body.accepted
  invites.updateInvite(inviteId, accepted).then(() => {
    response.success = true
    response.message = 'Successfully ' + (accepted === true ? 'accepted invite' : 'declined invite')
    res.status(200).json(response)
  }).catch((err) => {
    if (err.message === invites.ALREADY_ON_A_TEAM) {
      response.message = err.message
      return res.status(400).json(response)
    }
    return res.status(500).json(response)
  })
})

module.exports = {router}
