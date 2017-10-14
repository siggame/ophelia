'use strict'

/**
 * Queries for all relevant games for a specified team name. Only retrieves
 * games for the highest submission version
 * @param teamName String, name of the team to grab submissions for
 * @return {Promise} resolves when there are no errors, rejects if there is a
 *  problem
 */
function getGamesByTeamName (teamName) {
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
  getGamesByTeamName
}
