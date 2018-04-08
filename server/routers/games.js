'use strict'

const express = require('express')
const router = express.Router()
const dbGames = require('../db/init').games

// All paths in this file should start with this
const path = '/games'

/**
 * Expects URL parameters
 *  page: The requested page
 *  pageSize: How many games desired on each page
 * Responds with a body of the form:
 *{
    success: false,
    message: '',
    pages: 0,
    games: []
  }
 * Response codes:
 * 200 Successfully returned games
 * 400 Bad input, missing fields
 * 401 Unauthorized, not signed in
 * 500 Server error
 */
router.get(path + '/', (req, res, next) => {
  const response = {
    success: false,
    message: '',
    pages: 0,
    games: []
  }
  // Check for the existence of required parameters, and make sure that
  // they are passed as positive numbers
  const requiredValues = ['page', 'pageSize']
  for (const value of requiredValues) {
    let param = req.query[value]
    if (typeof param === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    } else if (typeof param !== 'number' && param <= 0) {
      response.message = value + ' must be a positive number'
      return res.status(400).json(response)
    }
  }
  // This is the signed in user, retrieved from the jwt
  const teamName = req.user.username
  // The specific page requested
  const page = req.query.page
  // How many games should be in each page
  const pageSize = req.query.pageSize

  dbGames.getGamesByTeamName(teamName, page, pageSize).then((games) => {
    const paginatedGames = createGroupedArray(games, pageSize)
    if (paginatedGames.length === 0) {
      return res.status(200).json(response)
    } else if (page > paginatedGames.length) {
      // response.message = 'Incorrect page number'
      // return res.status(400).json(response)
    }
    dbGames.countGamesByTeamName(teamName).then((count) => {
      response.success = true
      response.message = 'Games successfully retrieved'
      response.pages = Math.ceil(count / pageSize)
      // page - 1 because the array is indexed at 0
      // response.games = paginatedGames[page - 1]
      response.games = games
      return next(new Error('super test'))
      // return res.status(200).json(response)
    }).catch((err) => {
      return next(err)
    })
  }).catch((err) => {
    return next(err)
  })
  // else
  // success = 401
  // message = 'Not authorized'
})

router.get(path + '/:gameID', (req, res, next) => {
  // originally here
  // res.send('gameID is set to ' + req.params.gameID)
  const gameId = req.params.gameID
  const response = {
    success: false,
    message: '',
    game: null
  }
  dbGames.getGameById(gameId).then((result) => {
    response.success = true
    response.message = 'Game #' + gameId + ' successfully retrieved'
    response.game = result
    res.status(200).json(response)
  }).catch((err) => {
    return next(err)
  })
})

function createGroupedArray (arr, chunkSize) {
  const groups = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize))
  }
  return groups
}

module.exports = {router}
