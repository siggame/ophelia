'use strict'
const PG_UNIQUE_ERROR = '23505' // unique_violation error in postgres
const TEAMS_USERS_FOREIGN = 'teams_users_foreign'
const DUPLICATE_NAME_MESSAGE = 'Team name is already in use.'
const ALREADY_ON_A_TEAM = 'User is already on a team.'
const NO_SUCH_USER = 'No such user exists.'
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

function getTeamByName (teamName) {
  return new Promise((resolve, reject) => {
    knex('teams').where({
      name: teamName
    }).then((res) => {
      if (res.length <= 0) {
        resolve(null)
      }
      resolve(res[0])
    }).catch((err) => {
      reject(err)
    })
  })
}

function getAllTeamNames () {
  return new Promise((resolve, reject) => {
    knex('teams').select().then((data) => {
      let teamNames = []
      data.forEach((row) => {
        if (row.team_captain_id && row.is_eligible) {
          teamNames.push(row.name);
        }
      })
      return resolve(teamNames)
    }).catch((err) => {
      return reject(err)
    })
  })
}

function createTeam (name, teamCaptainId) {
  return new Promise((resolve, reject) => {
    // make sure the user creating this team is not already on a team (
    knex('teams_users').select().where('user_id', '=', teamCaptainId).then((data) => {
      if (data.length > 0) {
        return reject(new Error(ALREADY_ON_A_TEAM))
      }
      knex('teams').insert({
        name: name,
        is_eligible: true,
        is_paid: true,
        is_closed: false,
        team_captain_id: teamCaptainId
      }).then(() => {
        // get the id of the team
        knex('teams').select().where('team_captain_id', '=', teamCaptainId).then((data) => {
          // record the captain as part of the team in the teams_users table
          knex('teams_users').insert({
            user_id: teamCaptainId,
            team_id: data[0].id
          }).then(() => {
            resolve()
          }).catch((err) => {
            reject(err)
          })
        })
      }).catch((err) => {
        if (err.code === PG_UNIQUE_ERROR) {
          return reject(new Error(DUPLICATE_NAME_MESSAGE))
        } else if (err.constraint === TEAMS_USERS_FOREIGN) {
          return reject(new Error(NO_SUCH_USER))
        }
        return reject(err)
      })
    })
  })
}

function removeUserFromTeam (userId) {
  return new Promise((resolve, reject) => {
    knex('teams_users')
      .where('user_id', userId)
      .del().then(() => {
        return resolve()
      }).catch((err) => {
        return reject(err)
      })
  })
}

function deleteTeam (teamName) {
  return new Promise((resolve, reject) => {
    getTeamByName(teamName).then((team) => {
      knex('teams_users')
        .where('team_id', team.id)
        .del().then(() => {
          knex('invites')
            .where('team_id', team.id)
            .update({
              is_completed: true
            }).then(() => {
              knex('teams')
                .where('id', team.id)
                .update({
                  team_captain_id: null
                }).then(() => {
                  return resolve()
                }).catch((err) => {
                  return reject(err)
                })
            }).catch((err) => {
              return reject(err)
            })
        })
    })
  })
}

function editTeam (teamName, data) {
  return new Promise((resolve, reject) => {
    knex('teams')
      .where('teams.name', teamName)
      .update(data).then(() => {
        return resolve()
      }).catch((err) => {
        return reject(err)
      })
  })
}

module.exports = {
  getTeam,
  getTeamByName,
  getAllTeamNames,
  createTeam,
  removeUserFromTeam,
  deleteTeam,
  editTeam,
  ALREADY_ON_A_TEAM,
  DUPLICATE_NAME_MESSAGE,
  NO_SUCH_USER
}
