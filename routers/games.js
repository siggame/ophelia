'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

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
  res.send('gameID is set to ' + req.params.gameID)
})

module.exports = {router}
