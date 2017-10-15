'use strict'

const express = require('express')
const router = express.Router()
const db = require('../db/init')

// All paths in this file should start with this
const path = '/users'

router.get(path + '/', (req, res) => {

})

router.post(path + '/', (req, res) => {

})

router.get(path + '/:teamName', (req, res) => {
  res.send('teamName is set to ' + req.params.teamName)
})

router.put(path + '/:teamName', (req, res) => {
  const response = {
    success: false,
    message: ''
  }
  const userdata = req.body
  let data = {
    'contact_email': req.body['contactEmail'],
    'password': req.body['password']
  }
  db.teams.getTeamByName(req.params.teamName).then((result)=>{
    data['id'] = result[0].id
    db.teams.editTeam(data).then((result) =>{
      response.success = true
      response.message = 'Edited user successfully'
      res.status(200).json(response)
    },(err) => {
      response.message = err.message
      res.status(400).json(response)
    }).catch((err) => {
      response.message = err.message
      res.status(500).json(response)
    })
  },(err) => {
    response.message = err.message
    res.status(400).json(response)
  }).catch((err) => {
    response.message = err.message
    res.status(500).json(response)
  })  
})

module.exports = {router}
