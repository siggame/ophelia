'use strict'
// const config = require('./stuff.json') // How to "import" in JS
const PG_UNIQUE_ERROR = '23505' // unique_violation error in postgres
const DB_TEAM_UNIQUE = 'teams_name_unique'
const DB_EMAIL_UNIQUE = 'teams_contact_email_unique'

const knex = require('./connect').knex

function getTeam (teamId) {
  return new Promise((resolve, reject) => {
    knex('teams').where({
      id: teamId
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
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

function getTeamByName (teamName) {
  return new Promise((resolve, reject) => {
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

function editTeam (teamData) {
    // TODO: Some sort of checking on teamData
  return new Promise((resolve, reject) => {
    knex('teams').where({
      id: teamData.id
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
    }).then((insertId) => {
      return resolve()
    }, (err) => {
      if (err.code === PG_UNIQUE_ERROR) {
        if (err.constraint === DB_TEAM_UNIQUE) {
          return reject(new Error('Team name is already in use.'))
        } else if (err.constraint === DB_EMAIL_UNIQUE) {
          return reject(new Error('Team email is already in use.'))
        }
      }
      return reject(err)
    }).catch((err) => {
      return reject(err)
    })
  })
}

module.exports = {
  createTeam,
  getTeam,
  getTeamByName,
  editTeam,
  getAllTeamNames
}
