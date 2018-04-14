'use strict'

const teams = require('../db/init').teams
const compare = require('./auth').compare

/**
 * Uses a teamName and a password to check if a user is signed in
 * @param teamName - String -  The name of the team who we are trying to log in
 * @param password - String - The password of the team who is trying to log in
 * @return {Promise}
 *  resolve - (Boolean || User Info Object) -
 *      User Object if user successfully logs in
 *        {
 *          id: row ID,
 *          role: String
 *        }
 *      false if it worked, but password is wrong
 *      null if the user doesn't exist
 *  reject - (err) - Rejects if there is an error
 */
function login (teamName, password) {
  return new Promise((resolve, reject) => {
    teams.getTeamByName(teamName).then((team) => {
      if (!team || typeof team === 'undefined') {
        // If the team is undefined then there must not have been a match
        return resolve(null)
      } else {
        const encryptedPassword = team.password
        const salt = team.salt
        const iterations = team.hash_iterations
        // Checking to see if given password matches the one in the db
        if (compare(encryptedPassword, password, salt, iterations)) {
          const userInfo = {
            id: team.id,
            role: team.role
          }
          return resolve(userInfo)
        }
        // If compare failed then they must have given the wrong password
        return resolve(false)
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
