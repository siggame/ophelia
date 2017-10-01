'use strict'
// const config = require('./stuff.json') // How to "import" in JS
const PG_UNIQUE_ERROR = '23505' // unique_violation error in postgres
const DB_TEAM_UNIQUE = 'teams_name_unique'
const DB_EMAIL_UNIQUE = 'teams_contact_email_unique'
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

// Gets the team info by using the teamName that is passed to it
function getSubmissionByTeamName (teamName) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    knex.select('*')
      .from('submissions')
      .joinRaw('natural full join teams', function () {
        this.on('teams.id', '=', 'submissions.team_id')
          .onIn('teams.name', teamName)
      })
      .then((res) => {
        for (let row of res) {
          delete row['password']
        }
        return resolve(res)
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
    }).catch((err) => {
      if (err.code === PG_UNIQUE_ERROR) {
        if (err.constraint === DB_TEAM_UNIQUE) {
          return reject(new Error('Team name is already in use.'))
        } else if (err.constraint === DB_EMAIL_UNIQUE) {
          return reject(new Error('Team email is already in use.'))
        }
      }
      return reject(err)
    })
  })
}

module.exports = {
  createTeam: createTeam,
  getTeam: getTeam,
  getTeamByName: getTeamByName,
  editTeam: editTeam,
  getSubmissionByTeamName: getSubmissionByTeamName
}
