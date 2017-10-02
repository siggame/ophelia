'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

const path = '/submissions'

// All routes in this file are prefixed with /submissions

router.get(path + '/', (req, res) => {

})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:submissionID', (req, res) => {
  res.send('submissionID is set to ' + req.params.submissionID)
})

module.exports = {router}
