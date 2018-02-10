'use strict'

const express = require('express')
const router = express.Router()
const submissions = require('../db/init').submissions
const validator = require('validator')
// Acceptable mimetypes: application/zip application/octet-stream application/zip-compressed
// application/x-zip-compressed multipart/x-zip
const fileMimeTypeRegex = /((application\/(zip|octet-stream|zip-compressed|x-zip-compressed))|multipart\/x-zip)/

// All paths in this file should start with this
const path = '/submissions'

router.get(path + '/', (req, res) => {
  const user = 'bob'
  const response = {
    success: false,
    message: '',
    submissions: null
  }
  submissions.getSubmissionByTeamName(user).then((result) => {
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
  const response = {
    success: false,
    message: '',
    filename: '',
    mimeType: ''
  }
  // Validate whether or not the file received is the proper type
  if (!req.files) {
    response.message = 'No file were uploaded'
    return res.status(400).send(response)
  } else if (req.files.file.truncated) {
    // Check to make sure that the file size isn't too large
    response.message = 'File size is too large'
    response.filename = req.files.file.name
    response.mimeType = req.files.file.mimetype
    return res.status(400).send(response)
  } else if (!validator.matches(req.files.file.mimetype, fileMimeTypeRegex)) {
    // Check if file is of acceptable mimetype
    response.message = 'Not an acceptable file type. Must be a compressed (zip, rar, 7z.. etc) file'
    response.filename = req.files.file.name
    response.mimeType = req.files.file.mimetype
    return res.status(400).send(response)
  } else {
    response.message = 'File upload accepted'
    response.filename = req.files.file.name
    response.mimeType = req.files.file.mimetype
    return res.status(200).send(response)
  }
})

router.get(path + '/:submissionID', (req, res) => {
  res.send('submissionID is set to ' + req.params.submissionID)
})

module.exports = {router}
