'use strict'

const express = require('express')
const router = express.Router()
const jsonwebtoken  = require('jsonwebtoken')
const jwt           = require('express-jwt')
// const db = require('../db/init')

// All paths in this file should start with this
const path = '/signin'

router.post(path + '/', (req, res) => {

})

module.exports = {router}
