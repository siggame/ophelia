'use strict'

const express = require('express')
const router = express.Router()
const teams = require('../db/init').teams
const users = require('../db/init').users
const sanitizer = require('../utils/sanitizer')

const path = '/api'

router.post(path + '/stripe', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }

  const body = req.body
  
  console.log(body);

})

module.exports = {router}
