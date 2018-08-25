'use strict'
// const config = require('./stuff.json') // How to "import" in JS
const PG_UNIQUE_ERROR = '23505' // unique_violation error in postgres
const DB_USER_UNIQUE = 'users_name_unique'
const DB_EMAIL_UNIQUE = 'users_contact_email_unique'
const DUPLICATE_NAME_MESSAGE = 'Username is already in use.'
const DUPLICATE_EMAIL_MESSAGE = 'Email is invalid or already in use.'
const MISSING_FIELD_MESSAGE = 'All args. must be defined and not empty'
const knex = require('./connect').knex

function getUser (userId) {
  return new Promise((resolve, reject) => {
    knex('users').where({
      id: userId
    }).then((res) => {
      resolve(res[0])
    }).catch((err) => {
      reject(err)
    })
  })
}

function isUserAdmin (userId) {
  return new Promise((resolve, reject) => {
    getUser(userId).then((user) => {
      if (typeof user !== 'undefined' && user !== null) {
        return resolve(user.role === 'admin')
      }
      return resolve(false)
    }).catch((err) => { return reject(err) })
  })
}

/**
 * getAllUsernames - grabs all current teams from the database
 * @returns {Promise} - returns an array of strings if successful that contains all usernames in the database.
 */
function getAllUsernames () {
  return new Promise((resolve, reject) => {
    knex('users').select('name').then((data) => {
      let returnData = []
      data.forEach((row) => {
        returnData.push(row.name)
      })
      return resolve(returnData)
    }).catch((err) => {
      return reject(err)
    })
  })
}

function getAllUsers () {
  return new Promise((resolve, reject) => {
    knex('users').select(
      'id', 'name', 'contact_email', 'contact_name', 'active', 'role'
    ).then((data) => {
      return resolve(data)
    }).catch((err) => {
      return reject(err)
    })
  })
}

function getUserByName (name) {
  return new Promise((resolve, reject) => {
    if (arguments.length !== getUserByName.length) {
      return reject(new Error('All arguments required'))
    }
    knex('users').where({
      name: name
    }).then((user) => {
      if (user.length > 1) {
        reject(new Error('More than one user with same name'))
      } else {
        return resolve(user[0])
      }
    }).catch((err) => {
      return reject(err)
    })
  })
}

/**
 * Function to edit a User row in the database
 * @param name name of the user to be modified
 * @param dataToUpdate Object of data to update. Each field is optional but must
 *  have at least one filled out
 *    {
 *      name: String,
 *      email: String,
 *      password: {
 *          epass: String,
 *          salt: String,
 *          iterations: Number
 *      }
 *    }
 * @return {Promise} Resolves on success and rejects if invalid data is provided
 *  as well as when there are any errors
 */
function editUser (userId, dataToUpdate) {
  const userData = {}
  return new Promise((resolve, reject) => {
    if (arguments.length !== editUser.length) {
      return reject(new Error('All arguments required'))
    }
    for (const dataName in dataToUpdate) {
      if (dataToUpdate.hasOwnProperty(dataName)) {
        switch (dataName) {
          case 'name':
            userData.name = dataToUpdate[dataName]
            break
          case 'email':
            userData.contact_email = dataToUpdate[dataName]
            break
          case 'contactName':
            userData.contact_name = dataToUpdate[dataName]
            break
          case 'password':
            const passInfo = dataToUpdate[dataName]
            userData.password = passInfo.epass
            userData.salt = passInfo.salt
            userData.hash_iterations = passInfo.iterations
            break
          case 'active':
            userData.active = dataToUpdate[dataName]
            break
          case 'bio':
            userData.bio = dataToUpdate[dataName]
            break
          case 'profilePic':
            userData.profile_pic = dataToUpdate[dataName]
            break
          default:
            return reject(new Error('Can only edit name, email, and password'))
        }
      }
    }
    knex('users').where({
      id: userId
    }).update(userData).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Creates a user in the 'user' table
 * @param name string, Unique name of the user being created
 * @param email string, Unique, email of the user being created
 * @param password string, Hashed/Encrypted password for the user
 * @param salt string, salt used to Hash/Encrypt the password
 * @param hashIterations number, number used for PBKDF2 hashing
 * @param role string, role for the user, must be either 'user' or 'admin'
 * @param contactName string, this is the real name of the new user
 * @return {Promise} does not return anything on resolve
 */
function createUser (
  name,
  email,
  password,
  salt,
  hashIterations,
  role,
  contactName
) {
  return new Promise((resolve, reject) => {
    if (typeof name === 'undefined' || name === '' ||
            typeof email === 'undefined' || email === '' ||
            typeof password === 'undefined' || password === '' ||
            typeof salt === 'undefined' || salt === '' ||
            typeof hashIterations === 'undefined' ||
            typeof role === 'undefined' || role === '' ||
            typeof contactName === 'undefined' || contactName === '') {
      return reject(new Error('All args. must be defined and not empty'))
    }
    const userRoles = ['user', 'admin']
    if (!userRoles.includes(role)) {
      return reject(new Error('role must be in: ' + userRoles))
    }
    knex('users').insert({
      name: name,
      contact_email: email,
      password: password,
      salt: salt,
      hash_iterations: hashIterations,
      role: role,
      contact_name: contactName
    }).then(() => {
      return resolve()
    }).catch((err) => {
      if (err.code === PG_UNIQUE_ERROR) {
        if (err.constraint === DB_USER_UNIQUE) {
          return reject(new Error(DUPLICATE_NAME_MESSAGE))
        } else if (err.constraint === DB_EMAIL_UNIQUE) {
          return reject(new Error(DUPLICATE_EMAIL_MESSAGE))
        }
      }
      return reject(err)
    })
  })
}

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  isUserAdmin,
  getUserByName,
  editUser,
  getAllUsernames,
  DUPLICATE_EMAIL_MESSAGE,
  DUPLICATE_NAME_MESSAGE,
  MISSING_FIELD_MESSAGE
}
