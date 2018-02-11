'use strict'

const express = require('express')
const router = express.Router()
const submissions = require('../db/init').submissions
const validator = require('validator')
const arenaSubmissionEndpoint = require('../vars').ARENA_SUBMISSION_ENDPOINT
const request = require('request')
// Acceptable mimetypes: application/zip application/octet-stream application/zip-compressed
// application/x-zip-compressed multipart/x-zip
const fileMimeTypeRegex = /(application\/(zip|gzip))/

// All paths in this file should start with this
const path = '/submissions'

router.get(path + '/', (req, res) => {
  const user = req.user.username
  const response = {
    success: false,
    message: '',
    submissions: null
  }
  submissions.getSubmissionsByTeamName(user).then((result) => {
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
    return res.status(400).json(response)
  }
  response.filename = req.files.file.name
  response.mimeType = req.files.file.mimetype
  if (req.files.file.truncated) {
    // Check to make sure that the file size isn't too large
    response.message = 'File size is too large'
    return res.status(400).json(response)
  } else if (!validator.matches(req.files.file.mimetype, fileMimeTypeRegex)) {
    // Check if file is of acceptable mimetype
    response.message = 'Not an acceptable file type. Must be a compressed (zip, rar, 7z.. etc) file'
    return res.status(400).json(response)
  } else {
    // send file to arena submission end point here
    const options = {
      uri: arenaSubmissionEndpoint + '/' + req.user.username,
      method: 'POST'
    }
    const arenaRequest = request(options, function (err, arenaRes, body) {
      if (err) {
        response.message = 'Error sending response to arena'
        return res.status(500).json(response)
      } else {
        response.message = 'File successfully uploaded'
        response.success = true
        return res.status(200).json(response)
      }
    })
    const form = arenaRequest.form()
    form.append('file', req.files.file.data, {
      filename: req.files.file.name,
      contentType: req.files.file.mimetype
    })
  }
})

router.get(path + '/:submissionID', (req, res) => {
  const submissionID = req.params.submissionID
  const response = {
    success: false,
    message: '',
    submission: null
  }
  submissions.getSubmissionByID(submissionID).then((submission) => {
    if (typeof submission === 'undefined') {
      response.message = 'No submission with that ID'
      res.status(404).json(response)
    }
    response.success = true
    response.submission = submission
    console.log(submission)
    return res.status(200).json(response)
  }).catch((err) => {
    response.message = 'An error occured: ' + err.message
    res.status(500).json(err)
  })
})

module.exports = {router}
