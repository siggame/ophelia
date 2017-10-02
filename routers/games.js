'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

// All routes in this file are prefixed with /games

router.get('/', (req, res) => {

})

router.get('/:gameID', (req, res) => {
  res.send('gameID is set to ' + req.params.gameID)
})

module.exports = {router}
