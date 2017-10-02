'use strict'


const express       = require('express')
const jsonwebtoken  = require('jsonwebtoken')
const jwt           = require('express-jwt')

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password: '',
    database: 'postgres'
  }
})

const router = express.Router()

//Get username and password

function getUsernamePassword(username, password) {
  return new Promise((resolve, reject) => {
    if (username === null || password === null || typeof username === undefined || typeof password === undefined) {
      reject(new Error('Username or Password is null or undefined'))
    }
    knex('teams').where({
      name: username,
      password: password
    }).then((res) => {
      return resolve(res)
    }).catch((err) => {
      return reject('Could not find username and password', err)
    })
  })
}
