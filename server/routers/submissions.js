'use strict'

const express = require('express')
const router = express.Router()
const submissions = require('../db/init').submissions
const validator = require('validator')
const arenaSubmissionHost = require('../vars').ARENA_SUBMISSIONS_HOST
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
    message: ''
  }
  // Make sure there is a file uploaded
  if (!req.files) {
    response.message = 'No file were uploaded'
    return res.status(400).json(response)
  }
  // This is the file sent by the user
  const file = req.files.file
  // These are various components of the file we need
  const fileData = file.data
  const filename = file.name
  const mimeType = file.mimetype
  const truncated = file.truncated

  // This is the db ID of the user, stored in their JWT
  const userID = req.user.id
  if (truncated) {
    // Check to make sure that the file size isn't too large
    response.message = 'File size is too large'
    return res.status(400).json(response)
  } else if (!validator.matches(mimeType, fileMimeTypeRegex)) {
    // Here the file must have the incorrect MIME type
    response.message = 'Not an acceptable file type. Must be a compressed (zip, tar, tar.gz) file'
    return res.status(415).json(response)
  } else {
    // send file to arena submission end point here
    const options = {
      url: arenaSubmissionHost + '/submit/' + userID,
      method: 'POST'
    }
    const arenaRequest = request(options, function (err, arenaRes) {
      if (err) {
        response.message = 'Error sending response to arena'
        return res.status(500).json(response)
      } else if (arenaRes.statusCode >= 400) {
        response.message = 'Error sending response to arena'
        return res.status(500).json(response)
      } else {
        response.message = 'File successfully uploaded'
        response.success = true
        return res.status(200).json(response)
      }
    })
    const form = arenaRequest.form()
    form.append('submission', fileData, {
      filename: filename,
      contentType: mimeType
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
