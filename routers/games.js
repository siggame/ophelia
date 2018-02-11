'use strict'

const express = require('express')
const router = express.Router()
const games = require('../db/init').games

// How many games should be in each page
const PAGE_SIZE = 100

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {
  // This is the signed in user, retrieved from the jwt
  const teamName = req.user.username
  const page = req.query.page
  const response = {
    success: false,
    message: '',
    pages: 0,
    games: []
  }
  if (typeof page === 'undefined' || page === null) {
    // We need the page number in order to move on
    response.message = 'No page number included (param name: page)'
    return res.status(400).json(response)
  }

  // if user is auth'ed:
  games.getGamesByTeamName(teamName).then((games) => {
    const paginatedGames = createGroupedArray(games, PAGE_SIZE)
    if (page > paginatedGames.length) {
      response.message = 'Incorrect page number'
      return res.status(400).json(response)
    }
    response.success = true
    response.message = 'Games successfully retrieved'
    response.pages = paginatedGames.length
    // page - 1 because the array is indexed at 0
    response.games = paginatedGames[page - 1]
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = 'An error occurred: ' + err.message
    return res.status(500).json(response)
  })
  // else
  // success = 401
  // message = 'Not authorized'
})

router.get(path + '/:gameID', (req, res) => {
  // originally here
  // res.send('gameID is set to ' + req.params.gameID)
  const gameId = req.params.gameID
  const response = {
    success: false,
    message: '',
    game: null
  }
  games.getGameById(gameId).then((result) => {
    response.success = true
    response.message = 'Game #' + gameId + ' successfully retrieved'
    response.game = result
    res.status(200).json(response)
  }).catch((err) => {
    response.message = 'An error occurred: ' + err.message
    res.status(500).json(response)
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
