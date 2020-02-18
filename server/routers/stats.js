'use strict'

const express = require('express')
const router = express.Router()
const dbUsers = require('../db/init').users
const dbStats = require('../db/init').stats

// All paths in this file should start with this
const path = '/stats'

/**
 * Gets all the teams and how many wins each team has
 * Responds with body of the form:
 * {
 *    success: false,
 *    message: '',
 *    stats:[]
 * }
 * Response codes:
 * 200 Successfully return stats
 * 500 Server error
 */
router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    message: '',
    stats: []
  }
  dbStats.getTeamWinCounts().then((stats) => {
    response.success = true
    response.message = 'Stats successfully retrieved'
    response.stats = stats
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = 'An Error occurred: ' + err.message
    return res.status(500).json(response)
  })
})

/**
 * Gets all the teams and how many wins each team has
 * Responds with body of the form:
 * {
 *    success: false,
 *    message: '',
 *    leaderboard:[]
 * }
 * Response codes:
 * 200 Successfully return stats
 * 500 Server error
 */
router.get(path + '/leaderboard', (req, res) => {
  const response = {
    success: false,
    message: '',
    leaderboard: []
  }
  dbStats.getTeamWinCounts().then((wins) => {
    dbStats.getTeamLossCounts().then((losses) => {
      if (wins.length !== losses.length) {
        response.message = 'Wins and losses lengths are different for leaderboard'
        return res.status(500).json(response)
      }
      let ldb = wins.map((e, i) => {
        return {
          teamName: e['teamName'],
          wins: Number(e['winCount']),
          losses: Number(losses[i]['lossCount']),
          ratio: Number(e['winCount']) / (Number(e['winCount']) + Number(losses[i]['lossCount']))
        }
      })
      response.success = true
      response.message = 'Successfully retrieved leaderboard'
      response.leaderboard = ldb
      return res.status(200).json(response)
    }).catch((err) => {
      response.message = 'An Error occured: ' + err.message
      return res.status(500).json(response)
    })
  }).catch((err) => {
    response.message = 'An Error occured: ' + err.message
    return res.status(500).json(response)
  })
})

/**
 * Gets teams wins vs each other opponent (optionally by version)
 * Optional URL Parameters:
 *  version: The version of submission that played
 * Responds with a body of the form:
 * {
 *    success: false,
 *    message: '',
 *    stats: [
 *    {
 *      "name":
 *      "stats": {
 *        "wins":
 *        "losses":
 *      }
 *    },
 *    ]
 * }
 * Response codes:
 * 200 Successfully returns stats
 * 400 Invalid param inputs
 * 500 Server error
 */
router.get(path + '/teamStats', (req, res) => {
  const response = {
    success: false,
    message: '',
    stats: []
  }
  // optional field version number
  let param = req.query['version']
  const options = {}
  if (typeof param !== 'undefined') {
    if (isNaN(param) === true || Number(param) < 0) {
      response.message = 'Optional field version must be a nonnegative integer'
      return res.status(400).json(response)
    }
    options.version = parseInt(param)
  }
  const userId = req.user.id
  dbUsers.getUsersTeam(userId).then((teamName) => {
    dbStats.getTeamsWins(teamName, options).then((stats) => {
      response.success = true
      response.message = 'Statistics successfully retrieved'
      response.stats = stats
      return res.status(200).json(response)
    }).catch((err) => {
      response.message = 'An error occurred: ' + err.message
      return res.status(500).json(response)
    })
  })
})

/**
 * Gets the win/losses and ration for a specified team (optionally by version)
 * Optional URL Parameters:
 *  version: The version of submission that played
 * Responds with a body of the form:
 * {
 *    success: false,
 *    message: '',
 *    stats: {
 *      "wins":
 *      "losses":
 *      "totalGames":
 *      "winRatio":
 *    }
 * }
 * Response codes:
 * 200 Successfully returns stats
 * 400 Invalid param inputs
 * 500 Server error
 */
router.get(path + '/ratio/:teamName', (req, res) => {
  const teamName = req.params.teamName
  const response = {
    success: false,
    message: '',
    stats: {}
  }
  // optional field version number
  let param = req.query['version']
  const options = {}
  if (typeof param !== 'undefined') {
    if (isNaN(param) === true || Number(param) < 0) {
      response.message = 'Optional field version must be a nonnegative integer'
      return res.status(400).json(response)
    }
    options.version = parseInt(param)
  }
  dbStats.getWinLossRatio(teamName, options).then((stats) => {
    response.success = true
    response.message = 'Stats successfully retrieved'
    response.stats = stats
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = 'An error occurred' + err.message
    return res.status(500).json(response)
  })
})

module.exports = { router }
