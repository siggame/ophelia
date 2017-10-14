'use strict'

const knex = require('./connect').knex

/**
 * Joins teams and submissions tables together and returns resulting rows that
 * include the given name
 * @param teamName name of the team from the 'teams' table
 * @return {Promise} resolves with a list of submissions under that team name
 */
function getSubmissionByTeamName (teamName) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    knex('submissions')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .select('version', 'status', 'submission_url', 'log_url', 'image_name')
      .where('teams.name', '=', teamName)
      .then((res) => {
        return resolve(res)
      }).catch((err) => {
      return reject(err)
    })
  })
}

module.exports = {
  getSubmissionByTeamName
}
