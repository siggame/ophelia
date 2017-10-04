'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

// All paths in this file should start with this
const path = '/games'

router.get(path + '/', (req, res) => {

})

router.get(path + '/:gameID', (req, res) => {
  res.send('gameID is set to ' + req.params.gameID)
})

module.exports = {router}
