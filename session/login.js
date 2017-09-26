'use strict'

const sha256 = require('js-sha256')
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password: 'siggame',
    database: 'postgres'
  }
})

function login (name, pass) {
  console.log('name', name)
  return new Promise((resolve, reject) => {
        // Check username and password
    let query = knex('team').where({
      name: name
    }).select('password').then((res) => {
      let correctPass = res[0].password
      if (sha256(pass) === correctPass) {
                // Password is correct
        resolve('Success!')
      } else {
        reject('Incorrect Password')
      }
    }).catch((err) => {
      reject('Team not found')
    })
  })
}

module.exports = {
  login: login
}
