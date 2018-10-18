'use strict'

const knex = require('./connect').knex
const dbTeams = require('./teams')
const dbUsers = require('./users')
const ALREADY_ON_A_TEAM = 'User is already on a team.'

/**
 * Gets an invite by the given invite id
 * @param inviteId id of the invite
 * @returns {Promise}
 */
function getInviteById (inviteId) {
  return new Promise((resolve, reject) => {
    knex('invites').where({
      id: inviteId
    }).then((res) => {
      resolve(res[0])
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Gets all invites for a team
 * @param teamId id of the team the invites belong to
 * @returns {Promise}
 */
function getInvitesForTeam (teamId) {
  return new Promise((resolve, reject) => {
    knex('invites').where({
      team_id: teamId
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Gets all invites for a user
 * @param userId id of the user the invites belong to
 * @returns {Promise}
 */
function getInvitesForUser (userId) {
  return new Promise((resolve, reject) => {
    knex('invites').where({
      user_id: userId
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Creates a new invite with the given user and team id
 * @param teamId team id the invite originated from
 * @param userId user id that the invite is for
 * @returns {Promise}
 */
function createInvite (teamName, username) {
  return new Promise((resolve, reject) => {
    dbUsers.getUserByName(username).then((user) => {
      const userId = user.id
      knex('teams_users').select().where('user_id', '=', userId).then((data) => {
        if (data.length > 0) {
          return reject(new Error(ALREADY_ON_A_TEAM))
        }
        dbTeams.getTeamByName(teamName).then((team) => {
          knex('invites').insert({
            team_id: team.id,
            user_id: userId,
            is_completed: false
          }).then(() => {
            return resolve()
          }).catch((err) => {
            return reject(err)
          })
        }).catch((err) => {
          return reject(err)
        })
      }).catch((err) => {
        return reject(err)
      })
    })
  })
}

function updateInvite (inviteId, accepted) {
  return new Promise((resolve, reject) => {
    knex('invites').select().where('id', '=', inviteId).then((invite) => {
      // using the invite id we get the user_id and team_id of the invite
      const userId = invite[0].user_id
      const teamId = invite[0].team_id
      knex('teams_users').select().where('user_id', '=', userId).then((data) => {
        // check if the user is already on a team
        if (data.length > 0) {
          return reject(new Error(ALREADY_ON_A_TEAM))
        }
        // if not we update the invite to be completed
        knex('invites').where({
          user_id: userId,
          team_id: teamId
        }).update({
          is_completed: true
        }).then(() => {
          // if the invite was accepted then update the teams_users table with the new user on the team
          if (accepted) {
            knex('teams_users').insert({
              team_id: teamId,
              user_id: userId
            }).then(() => {
              return resolve()
            }).catch((err) => {
              return reject(err)
            })
          } else {
            resolve()
          }
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

module.exports = {
  getInviteById,
  getInvitesForTeam,
  getInvitesForUser,
  createInvite,
  updateInvite,
  ALREADY_ON_A_TEAM
}
