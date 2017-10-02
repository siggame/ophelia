'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

const path = '/games'

router.get(path + '/', (req, res) => {

})

router.get(path + '/:gameID', (req, res) => {
  res.send('gameID is set to ' + req.params.gameID)
})

module.exports = {router}
