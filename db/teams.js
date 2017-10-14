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
    }).then((res) => {
      return resolve(res)
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
 * @param isEligible boolean, for whether team is eligible
 * @return {Promise} does not return anything on resolve
 */
function createTeam (teamName, email, password, isEligible) {
  return new Promise((resolve, reject) => {
    if (typeof teamName === 'undefined' || teamName === '' ||
            typeof email === 'undefined' || email === '' ||
            typeof password === 'undefined' || password === '' ||
            typeof isEligible === 'undefined' || typeof isEligible !== 'boolean') {
      return reject(new Error('All args. must be defined and not empty'))
    }
    knex('teams').insert({
      name: teamName,
      contact_email: email,
      password: password,
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

/**
 * Queries for all relevant games for a specified team name. Only retrieves
 * games for the highest submission version
 * @param teamName String, name of the team to grab submissions for
 * @return {Promise} resolves when there are no errors, rejects if there is a
 *  problem
 */
function getGame (teamName) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    knex('games')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions', 'submissions.id', '=', 'games_submissions.submission_id').where('version', '=', knex('submissions').max('version'))
      .join('teams', 'teams.id', '=', 'submissions.team_id').where('teams.name', '=', teamName)
      .select('games.status', 'games.win_reason', 'games.lose_reason', 'games.winner_id', 'games.log_url')
      .then((res) => {
        return resolve(res)
      }).catch((err) => {
        return reject(err)
      })
  })
}

module.exports = {
  createTeam: createTeam,
  getTeam: getTeam,
  getTeamByName: getTeamByName,
  editTeam: editTeam,
  getGame: getGame,
  getAllTeamNames: getAllTeamNames
}
