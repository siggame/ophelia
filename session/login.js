'use strict'

const teams = require('../db/init').teams
const compare = require('./auth').compare

/**
 * Uses a teamName and a password to check if a user is signed in
 * @param teamName - String -  The name of the team who we are trying to log in
 * @param password - String - The password of the team who is trying to log in
 * @return {Promise}
 *  resolve - ({ success: Boolean, role: String}) - If success, passes role
 *  reject - (err) - Rejects if there is an error
 */
function login (teamName, password) {
  const response = {
    success: false,
    role: ''
  }
  return new Promise((resolve, reject) => {
    teams.getTeamByName(teamName).then((team) => {
      if (typeof team === 'undefined') {
        // If the team is undefined then there must not have been a match
        return resolve(response)
      } else {
        const encryptedPassword = team.password
        const salt = team.salt
        const iterations = team.hash_iterations
        const role = team.role
        // Checking to see if given password matches the one in the db
        if (compare(encryptedPassword, password, salt, iterations)) {
          response.success = true
          response.role = role
          return resolve(response)
        }
        // If compare failed then they must have given the wrong password
        return resolve(response)
      }
    }, (err) => {
      reject(err)
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  login
}
