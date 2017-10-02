'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

// All routes in this file are prefixed with /submissions

router.get('/', (req, res) => {

})

router.post('/', (req, res) => {

})

router.get('/:submissionID', (req, res) => {
  res.send('submissionID is set to ' + req.params.submissionID)
})

module.exports = {router}
