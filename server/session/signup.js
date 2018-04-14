'use strict'

const validator = require('validator')
const _ = require('lodash')
const sha256 = require('js-sha256')
// TODO: Make env variables file, and provide an example for new devs
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
const db = require('../db/init')

function signup (username, pass, passConfirm, contactName, contactEmail, isEligible) {
  // TODO: Error handling similar to Editing Profiles
  return new Promise((resolve, reject) => {
    let errorObject = {}

    if (pass !== passConfirm) {
      errorObject.passwordMismatch = true
    }

    if (!validator.isEmail(contactEmail)) {
      errorObject.invalidEmail = true
    }

    db.teams.getTeamByName(username).then((res) => {
      if (res) {
        if (res.name === username) {
          errorObject.duplicateUsername = true
        }
      }
      if (!_.isEmpty(errorObject)) {
        reject(errorObject)
      } else {
        knex('team').insert({
          name: username,
          contact_name: contactName,
          contact_email: contactEmail,
          password: sha256(pass),
          is_eligible: isEligible
        }).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  signup: signup
}
