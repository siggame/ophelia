'use strict'

const express = require('express')
const router = express.Router()
// const db = require('../db/init')

// All paths in this file should start with this
const path = '/submissions'

router.get(path + '/', (req, res) => {

})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:submissionID', (req, res) => {
  res.send('submissionID is set to ' + req.params.submissionID)
})

module.exports = {router}
