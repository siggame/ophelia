'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {
	var teamName = 'fix me'
	var games = [];
	var success
	var message = ''
	// if user is auth'ed
	//	get his teamName
	db.teams.getGame(teamName).then((res) => {
		// maybe check if res is empty
	    games = res
	   	success = 200
	   	message = 'OK'
	  }, (err) => {
	    success = 500
	 	message = 'Unknown internal error'
	  }
	).catch((err) => {
	  success = 500
	  message = 'Unknown internal error'
	})
	// else
	//	success = 401
	// 	message = 'Not authorized'
	return {success, message, games} // not sure if this is the right syntax
})

router.get(path + '/:gameID', (req, res) => {
  res.send('gameID is set to ' + req.params.gameID)
})

module.exports = {router}
