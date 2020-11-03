'use strict'

const express = require('express')
const router = express.Router()

const path = '/api'

router.post(path + '/stripe', (req, res, next) => {
  const response = {
    success: false,
    message: ''
  }

  const body = req.body
  
  console.log(body);
  response.success = true;

  return res.status(200).json(response);

})

module.exports = {router}
