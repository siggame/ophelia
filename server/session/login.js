'use strict'

const users = require('../db/init').users
const compare = require('./auth').compare

/**
 * Uses a username and a password to check if a user is signed in
 * @param username - String -  The username of the user who we are trying to log in
 * @param password - String - The password of the user who is trying to log in
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
function login (username, password) {
  return new Promise((resolve, reject) => {
    users.getUserByName(username).then((user) => {
      if (!user || typeof user === 'undefined') {
        // If the team is undefined then there must not have been a match
        console.warn("undefined user");
        return resolve(null)
      } else {
        const encryptedPassword = user.password
        const salt = user.salt
        const iterations = user.hash_iterations
        // Checking to see if given password matches the one in the db
        if (compare(encryptedPassword, password, salt, iterations)) {
          const userInfo = {
            id: user.id,
            role: user.role
          }
          return resolve(userInfo)
        }
        // If compare failed then they must have given the wrong password
        console.warn("failed compare");
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
