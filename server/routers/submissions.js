'use strict'

const express = require('express')
const router = express.Router()
const submissions = require('../db/init').submissions
const validator = require('validator')
const ARENA_HOST = require('../vars').ARENA_HOST
const languages = require('../vars').LANGUAGES
const dbUsers = require('../db/init').users
// TCP Sockets
const net = require('net')

// Acceptable mimetypes: application/zip application/octet-stream application/zip-compressed
// application/x-zip-compressed multipart/x-zip
const fileMimeTypeRegex = /(application\/(x-)?(zip|gzip|tar))/

// All paths in this file should start with this
const path = '/submissions'

router.get(path + '/', (req, res, next) => {
  const userId = req.user.id
  const response = {
    success: false,
    message: '',
    submissions: null
  }
  dbUsers.getUsersTeam(userId).then((teamName) => {
    submissions.getSubmissionsByTeamName(teamName).then((result) => {
      response.success = true
      response.message = 'Data successfully retrieved'
      response.submissions = result
      return res.status(200).json(response)
    }, (err) => {
      return next(err)
    }).catch((err) => {
      return next(err)
    })
  })
})

router.get(path + '/:version', (req, res, next) => {
  const userId = req.user.id
  const version = req.params.version
  dbUsers.getUsersTeam(userId).then((teamName) => {
    submissions.downloadSubmission(teamName, version).then((data) => {
      const fileData = data.data
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': 'attachment;filename=' + 'test.zip',
        'Content-Length': fileData.length
      })
      return res.end(Buffer.from(fileData, 'binary'));
    }).catch((err) => {
      return next(err)
    })
  }).catch((err) => {
    return next(err)
  })
})

/**
 * Submits code to the arena
 * Request body format:
 *  multipart form of the file in question
 * Expected URL Parameters
 *  lang: The language slug that they want to submit this code as
 *      list of acceptable languages defined in vars.js
 * Response body format:
 * {
 *     success: Boolean, - true if success, false otherwise
 *     message: String - error message/success message
 * }
 * Response codes:
 * 201 - Successfully created
 * 400 - User error
 * 500 - Something went wrong
 */
router.post(path + '/', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  // Make sure there is a file uploaded
  if (!req.files) {
    response.message = 'No file were uploaded'
    return res.status(400).json(response)
  }
  // Check for the existence of required parameters, and make sure that
  // they are passed as positive numbers
  const requiredValues = ['lang']
  for (const value of requiredValues) {
    let param = req.query[value]
    if (typeof param === 'undefined') {
      response.message = 'Required field ' + value + ' is missing or blank'
      return res.status(400).json(response)
    } else if (value === 'lang' && !languages.includes(param)) {
      response.message = value + ' must be one of: ' + languages
      return res.status(400).json(response)
    }
  }
  // This is the file sent by the user
  const file = req.files.file
  // These are various components of the file we need
  const fileData = file.data
  const mimeType = file.mimetype
  const truncated = file.truncated

  // This is the language that the user is submitting their code as
  const lang = req.query.lang
  // This is the db ID of the user, stored in their JWT
  const userId = req.user.id
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
    dbUsers.getUsersTeam(userId).then((teamName) => {
      submissions.getSubmissionVersion(teamName).then((version) => {
        // submitting the next version
        const nextVersion = version + 1
        const newFileName = teamName + '_' + nextVersion + '_' + lang
        console.log(lang)
        submissions.submitSubmission(teamName, fileData, nextVersion, lang).then(() => {
          response.success = true
          response.message = 'Successfully submitted code'
          return res.status(200).json(response)
        }).catch((err) => {
          return res.status(500).json(err)
        })
      })
    }).catch((err) => {
      return res.status(500).json(err)
    })
  }
})

router.get(path + '/:submissionID', (req, res, next) => {
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
    return res.status(200).json(response)
  }).catch((err) => {
    return next(err)
  })
})

router.put(path + '/', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }
  const teamName = req.body.teamName
  const status = req.body.status
  submissions.updateSubmission(teamName, status).then(() => {
    response.success = true
    response.message = 'Successfully updated status'
    return res.status(200).json(response)
  }).catch((err) => {
    next(err)
  })
})

function sendZipFile (zipBytes, fileName) { // Function definition
  const ARENA_HOST_IP = ARENA_HOST // This is Google Cloud ARENA Address
  console.log('Using arena ip: ' + ARENA_HOST_IP)
  console.log(zipBytes.length)
  fileName = fileName.concat('.zip')
  console.log('File Name: ' + fileName)
  const ARENA_HOST_PORT = 21 // This should stay the same
  let ARENA_TRANSACTION_PORT // Calculated after sending PASV command

  const sendFile = new net.Socket() // You do not need to create a server now..just another client to send the file bytes on.

  const client = new net.Socket() // This is a client to send commands back and forth with.
  client.connect(ARENA_HOST_PORT, ARENA_HOST_IP, async function () { // Connect to Arena to send commands
    console.log('CONNECTED TO: ' + ARENA_HOST_IP + ':' + ARENA_HOST_PORT)
  })
  // Add a 'data' event handler for the client socket
  // data is what the server sent to this socket
  client.on('data', function (data) { // When I send you data write it to the console and send me an appropriate response
    console.log('DATA: ' + data)
    if (data.includes('Service Ready')) {
      client.write('USER Guest\n') // Username
    } else if (data.includes('need password')) {
      client.write('PASS \n') // Password is nothing right now
    } else if (data.includes('logged in')) {
      client.write('PASV\n') // Tells me how you will send file.
    } else if (data.includes('Entering Passive')) {
      console.log(typeof (data))
      const split = data.toString().split(',')
      console.log(split)
      console.log(split[split.length - 2])
      const p1 = parseInt(split[split.length - 2])
      const splitAgain = split[split.length - 1].split(')')
      console.log(splitAgain)
      console.log(splitAgain[0])
      const p2 = parseInt(splitAgain[0])
      ARENA_TRANSACTION_PORT = p1 * 256 + p2
      console.log(ARENA_TRANSACTION_PORT)
      sendFile.connect(ARENA_TRANSACTION_PORT, ARENA_HOST_IP, async function () { // When I connect just send me the file and then immediately destory the connection.
        console.log('Client connected to ' + ARENA_HOST_IP + ':' + ARENA_TRANSACTION_PORT)
        console.log('CONNECTED: ' + sendFile.remoteAddress + ':' + sendFile.remotePort)
        // other stuff is the same from here
        sendFile.write(zipBytes, () => {
          console.log('Finished sending!')
          sendFile.end()
          sendFile.destroy()
        })
        console.log('sent file')
        console.log('destroyed connection')
      })
      client.write('TYPE I\n') // Tell me its a stream of bytes
    } else if (data.includes('Type set')) {
      client.write('STOR ' + fileName + '\n') // Tell me the file name.
    } else if (data.includes('Closing data')) { // When this is sent I have successfully received file.
      client.write('QUIT 221')
    }
  })

  client.on('error', function (err) {
    console.log(err)
  })
}

module.exports = {router}
