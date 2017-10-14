'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

// All paths in this file should start with this
const path = '/submissions'

router.get(path + '/', (req, res) => {
  const user = 'bob'
  const response = {
    success: false,
    message: '',
    submissions: null
  }
  db.submissions.getSubmissionByTeamName(user).then((result) => {
    response.success = true
    response.message = 'Data successfully retrieved'
    response.submissions = result
    res.status(200).json(response)
  }, (err) => {
    response.message = err.message
    res.status(500).json(response)
  }).catch((err) => {
    response.message = 'An error occured: ' + err.message
    res.status(500).json(err)
  })
})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:submissionID', (req, res) => {
  res.send('submissionID is set to ' + req.params.submissionID)
})

module.exports = {router}
