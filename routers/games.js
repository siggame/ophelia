'use strict'

const express = require('express')
const router = express.Router()
const games = require('../db/init').games

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {
	// TODO: Replace w/ auth'd user
	const teamName = ''
	const response = {
		success: false,
		message: '',
		games: []
	}
	// if user is auth'ed:
	db.games.getGamesByTeamName(teamName).then((result) => {
		response.success = true
		response.message = 'Games successfully retrieved'
		response.games = result
		return res.status(200).json(response)
	}).catch((err) => {
		response.message = 'An error occurred: ' + err.message
		return res.status(500).json(response)
	})
	// else
	//	success = 401
	// 	message = 'Not authorized'
	
})

router.get(path + '/:gameID', (req, res) => {
	// orginally here
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
		response.message = 'An error occured: ' + err.message
		res.status(500).json(response)
	})
})

module.exports = {router}
