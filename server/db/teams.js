'use strict'
// const config = require('./stuff.json') // How to "import" in JS
const PG_UNIQUE_ERROR = '23505' // unique_violation error in postgres
const DB_TEAM_UNIQUE = 'teams_name_unique'
const DB_EMAIL_UNIQUE = 'teams_contact_email_unique'
const DUPLICATE_NAME_MESSAGE = 'Team name is already in use.'
const DUPLICATE_EMAIL_MESSAGE = 'Email is invalid or already in use.'
const MISSING_FIELD_MESSAGE = 'All args. must be defined and not empty'
const knex = require('./connect').knex

function getTeam (teamId) {
  return new Promise((resolve, reject) => {
    knex('teams').where({
      id: teamId
    }).then((res) => {
      resolve(res[0])
    }).catch((err) => {
      reject(err)
    })
  })
}

function isUserAdmin (teamId) {
  return new Promise((resolve, reject) => {
    getTeam(teamId).then((team) => {
      if (typeof team !== 'undefined' && team !== null) {
        return resolve(team.role === 'admin')
      }
      return resolve(false)
    }).catch((err) => { return reject(err) })
  })
}

/**
 * getAllTeamNames - grabs all current teams from the database
 * @returns {Promise} - returns an array of strings if successful that contains all team names in the database.
 */
function getAllTeamNames () {
  return new Promise((resolve, reject) => {
    knex('teams').select('name').then((data) => {
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

function getAllTeams () {
  return new Promise((resolve, reject) => {
    knex('teams').select(
      'id', 'name', 'contact_email', 'contact_name', 'is_eligible', 'role'
    ).then((data) => {
      return resolve(data)
    }).catch((err) => {
      return reject(err)
    })
  })
}

function getTeamByName (teamName) {
  return new Promise((resolve, reject) => {
    if (arguments.length !== getTeamByName.length) {
      return reject(new Error('All arguments required'))
    }
    knex('teams').where({
      name: teamName
    }).then((team) => {
      if (team.length > 1) {
        reject(new Error('More than one team with same name'))
      } else {
        return resolve(team[0])
      }
    }).catch((err) => {
      return reject(err)
    })
  })
}

/**
 * Function to edit a Team row in the database
 * @param teamName name of the team to be modified
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
function editTeam (teamName, dataToUpdate) {
  const teamData = {}
  return new Promise((resolve, reject) => {
    if (arguments.length !== editTeam.length) {
      return reject(new Error('All arguments required'))
    }
    for (const dataName in dataToUpdate) {
      if (dataToUpdate.hasOwnProperty(dataName)) {
        switch (dataName) {
          case 'name':
            teamData.contact_name = dataToUpdate[dataName]
            break
          case 'email':
            teamData.contact_email = dataToUpdate[dataName]
            break
          case 'password':
            const passInfo = dataToUpdate[dataName]
            teamData.password = passInfo.epass
            teamData.salt = passInfo.salt
            teamData.hash_iterations = passInfo.iterations
            break
          default:
            return reject(new Error('Can only edit name, email, and password'))
        }
      }
    }
    knex('teams').where({
      name: teamName
    }).update(teamData).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Creates a team in the 'teams' table
 * @param teamName string, Unique name of the team being created
 * @param email string, Unique, email of the team being created
 * @param password string, Hashed/Encrypted password for the team
 * @param salt string, salt used to Hash/Encrypt the password
 * @param hashIterations number, number used for PBKDF2 hashing
 * @param role string, role for the user, must be either 'user' or 'admin'
 * @param name string, this is the contact_name of the new team
 * @param isEligible boolean, for whether team is eligible
 * @return {Promise} does not return anything on resolve
 */
function createTeam (
  teamName,
  email,
  password,
  salt,
  hashIterations,
  role,
  name,
  isEligible) {
  return new Promise((resolve, reject) => {
    if (typeof teamName === 'undefined' || teamName === '' ||
            typeof email === 'undefined' || email === '' ||
            typeof password === 'undefined' || password === '' ||
            typeof salt === 'undefined' || salt === '' ||
            typeof hashIterations === 'undefined' ||
            typeof hashIterations !== 'number' ||
            typeof role === 'undefined' || role === '' ||
            typeof name === 'undefined' || name === '' ||
            typeof isEligible === 'undefined' || typeof isEligible !== 'boolean') {
      return reject(new Error('All args. must be defined and not empty'))
    }
    const userRoles = ['user', 'admin']
    if (!userRoles.includes(role)) {
      return reject(new Error('role must be in: ' + userRoles))
    }
    knex('teams').insert({
      name: teamName,
      contact_email: email,
      password: password,
      salt: salt,
      hash_iterations: hashIterations,
      role: role,
      contact_name: name,
      is_eligible: isEligible
    }).then(() => {
      return resolve()
    }).catch((err) => {
      if (err.code === PG_UNIQUE_ERROR) {
        if (err.constraint === DB_TEAM_UNIQUE) {
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
  createTeam,
  getTeam,
  getAllTeams,
  isUserAdmin,
  getTeamByName,
  editTeam,
  getAllTeamNames,
  DUPLICATE_EMAIL_MESSAGE,
  DUPLICATE_NAME_MESSAGE,
  MISSING_FIELD_MESSAGE
}
