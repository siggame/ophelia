'use strict'

const knex = require('./connect').knex

/**
 * Queries for all relevant games for a specified team name. Only retrieves
 * games for the highest submission version
 * @param teamName String, name of the team to grab submissions for
 * @param page number, desired page
 * @param pageSize number, size of each page
 * @return {Promise} resolves when there are no errors, rejects if there is a
 *  problem
 */
function getGamesByTeamName (teamName, page, pageSize) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    const gameIDs = []
    const versions = []
    /*
      Here we join all the tables together to get a list of ids from
      the games table that we will use in the next query.
      We then limit how many rows we are getting by created_at,
      and then limiting them to one pageSize worth of games,
      offset to the specific page we want.
      We also use this to get the version number of the submission
      that the given teamName submitted.
    */
    const gamesQuery = knex('games')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .where('teams.name', '=', teamName)
      .select('games.id', 'games.created_at', 'games.updated_at',
        'submissions.version')
      .orderBy('games.created_at', 'desc')
      .limit(pageSize).offset((page - 1) * pageSize)
    gamesQuery.then((rows) => {
      // This gets the IDs for each game that the user is in
      rows.forEach((row) => { gameIDs.push(row.id) })
      // Get a list of versions associated with game IDs
      rows.forEach((row) => {
        versions.push({
          gameID: row.id,
          version: row.version
        })
      })
      /*
       Here we join all of the tables together, limiting it to the
       gameIDs we found in the earlier query, as well as only looking
       for rows where the team name is not the same as our given name
       because we are only looking for the opponents name
      */
      const submissions = knex('submissions')
        .join('games_submissions',
          'games_submissions.submission_id', '=', 'submissions.id')
        .join('games', 'games_submissions.game_id', '=', 'games.id')
        .where('games.id', 'in', gameIDs)
        .join('teams', 'teams.id', '=', 'submissions.team_id')
        .select('submissions.team_id',
          'games.id',
          'teams.name',
          'games.status',
          'games.win_reason',
          'games.lose_reason',
          'games.winner_id',
          'games.log_url',
          'games.created_at',
          'games.updated_at')
        .where('teams.name', '!=', teamName)

      submissions.then((subRows) => {
        console.log(subRows)
        const games = []
        for (const row of subRows) {
          let game = row
          // This finds the version number of the teamName we searched for
          // By using the array we made earlier to store them together
          let ver = versions.find(o => o.gameID === row.id)
          game.version = ver.version
          game.opponent = row.name
          delete game.name
          if (game.team_id === game.winner_id) {
            game.winner = game.opponent
          } else {
            game.winner = teamName
          }
          delete game.winner_id
          delete game.team_id
          games.push(game)
        }
        // We need to re-sort the games
        games.sort(sortGames)
        return resolve(games)
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

function getGameById (gameId) {
  return new Promise((resolve, reject) => {
    if (gameId === null || typeof gameId === 'undefined') {
      return reject(new Error('gameId is null or undefined'))
    }
    knex
      .select('status', 'win_reason', 'lose_reason', 'winner_id', 'log_url')
      .from('games')
      .where('id', '=', gameId)
      .then((res) => {
        return resolve(res)
      }).catch((err) => {
        return reject(err)
      })
  })
}

function sortGames (gameA, gameB) {
  const dateA = new Date(gameA.created_at)
  const dateB = new Date(gameB.created_at)
  if (dateA > dateB) {
    return -1
  }
  if (dateA < dateB) {
    return 1
  }
  return 0
}

module.exports = {
  getGamesByTeamName,
  getGameById
}
