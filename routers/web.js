'use strict'

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {title: 'MegaminerAI', user: req.session.user})
})

router.get('/api/test', (req, res) => {
  res.send({
    test: 'hi ell'
  })
})

module.exports = {router}
