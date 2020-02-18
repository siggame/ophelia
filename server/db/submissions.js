'use strict'

const knex = require('./connect').knex
const host = require('../vars').SERVER_HOST
const logEndpoint = require('../vars').LOG_ENDPOINT
const dbTeams = require('./teams')

/**
 * Joins teams and submissions tables together and returns resulting rows that
 * include the given name
 * @param teamName name of the team from the 'teams' table
 * @return {Promise} resolves with a list of submissions under that team name
 */
function getSubmissionsByTeamName (teamName) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    knex('submissions')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .select('version', 'status', 'submission_url', 'log_url', 'image_name',
        'submissions.created_at', 'submissions.updated_at')
      .where('teams.name', '=', teamName)
      .then((submissions) => {
        submissions.sort(sortSubmissions)
        return resolve(submissions)
      }).catch((err) => {
        return reject(err)
      })
  })
}

function getSubmissionVersion (teamName) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    knex('submissions')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .max('version')
      .where('teams.name', '=', teamName)
      .then((submission) => {
        resolve(submission[0].max)
      }).catch((err) => {
        return reject(err)
      })
  })
}

function getSubmissionByID (submissionID) {
  return new Promise((resolve, reject) => {
    if (submissionID === null || typeof submissionID === 'undefined') {
      reject(new Error('submissionId is null or undefined'))
    }
    const query = knex('submissions')
      .select('id', 'status', 'log_url', 'version', 'created_at', 'updated_at')
      .where('id', '=', submissionID)
    query.then((submission) => {
      // This will let us contact the correct endpoint to actually retrieve
      // the log url from the arena
      if (submission[0].log_url !== null) {
        submission[0].log_url = submission[0].log_url
      }
      return resolve(submission[0])
    }).catch((err) => {
      return reject(err)
    })
  })
}

function submitSubmission (teamName, fileData, nextVersion, lang) {
  return new Promise((resolve, reject) => {
    dbTeams.getTeamByName(teamName).then((team) => {
      knex('submissions')
        .insert({
          team_id: team.id,
          version: nextVersion,
          data: fileData,
          status: 'finished',
          lang: lang
        }).then(() => {
          resolve()
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  })
}

function updateSubmission (teamName, status) {
  return new Promise((resolve, reject) => {
    dbTeams.getTeamByName(teamName).then((team) => {
      knex('submissions')
        .insert({
          team_id: team.id,
          status: status
        }).then(() => {
          resolve()
        }).catch((err) => {
          reject(err)
        })
    })
  })
}

function downloadSubmission (teamName, version) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    knex('submissions')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .select('data')
      .where('teams.name', '=', teamName)
      .where('submissions.version', '=', version)
      .then((fileData) => {
        return resolve(fileData[0])
      }).catch((err) => {
        return reject(err)
      })
  })
}

function sortSubmissions (submissionA, submissionB) {
  const versionA = submissionA.version
  const versionB = submissionB.version
  if (versionA > versionB) {
    return -1
  }
  if (versionA < versionB) {
    return 1
  }
  return 0
}

module.exports = {
  getSubmissionsByTeamName,
  getSubmissionByID,
  getSubmissionVersion,
  submitSubmission,
  updateSubmission,
  downloadSubmission
}
