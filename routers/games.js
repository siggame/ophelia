'use strict'

const express = require('express')
const router = express.Router()
const games = require('../db/init').games

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {
	const teamName = 'fix me'
	const response = {
		success: false,
		message: '',
		games: []
	}
	// if user is auth'ed:
	games.getGamesByTeamName(teamName).then((result) => {
		// maybe check if res is empty
	    response.success = true
	    response.message = 'Games successfully retrieved'
	    resposne.games = result
	    res.status(200).json(response)
	}, (err) => {
		response.message = err.message
		res.status(500).json(response)
	}).catch((err) => {
		response.message = 'An error occured: ' + err.message
		res.status(500).json(err)
	})
	// else
	//	success = 401
	// 	message = 'Not authorized'
	
})

router.get(path + '/:gameID', (req, res) => {
  res.send('gameID is set to ' + req.params.gameID)
})

module.exports = {router}
