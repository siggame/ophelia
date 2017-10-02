'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

// All routes in this file are prefixed with /users

router.get('/', (req, res) => {

})

router.post('/', (req, res) => {

})

router.get('/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

router.put('/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

module.exports = {router}
