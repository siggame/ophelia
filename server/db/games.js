'use strict'

const knex = require('./connect').knex
const host = require('../vars').SERVER_HOST
const logEndpoint = require('../vars').LOG_ENDPOINT
/**
 * Queries for all relevant games for a specified team name. Only retrieves
 * games for the highest submission version
 * @param teamName String, name of the team to grab submissions for
 * @param page number, desired page
 * @param pageSize number, size of each page
 * @param options filtering options
 * {
 *    version: number,
 *    result: 'win' | 'loss'
 * }
 * @return {Promise} resolves when there are no errors, rejects if there is a
 *  problem
 */
function getGamesByTeamName (teamName, page, pageSize, options) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    // This is the offset for the query, it subtracts 1 from the page
    // so that page 1 causes it to be 0, which will work like it isn't there
    const offset = (page - 1) * pageSize
    /*
      This sub query is to find the rows of the current player. It joins
      all of the required tables together and selects the rows out that have
      the teams.name column = the passed in team name
     */
    const playerQuery = knex('games')
      .select(
        'games.id as game_id',
        'games.status',
        'submissions.version',
        'submissions.id as submission_id',
        'games.win_reason',
        'games.lose_reason',
        'games.winner_id',
        'games.log_url',
        'games.created_at',
        'games.updated_at'
      )
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', function () {
        this.on('teams.id', '=', 'submissions.team_id')
        // Checks the 'options' parameter for the result field
        if (typeof options.result !== 'undefined') {
          // If it is win then we need to check if the submission id is equal to
          // the winner id on the game
          if (options.result === 'win') {
            this.andOn('games.winner_id', '=', 'submission_id')
          } else if (options.result === 'loss') {
            this.andOn('games.winner_id', '!=', 'submission_id')
          }
        }
      })
      .where('teams.name', '=', teamName)
      // gives this sub query the alias 'player'
      .as('player')
    if (typeof options.version !== 'undefined') {
      playerQuery.andWhere('submissions.version', '=', options.version)
    }
    /*
      This sub query is just like the one above, except this will be looking for
      the opponent. It doesn't need the extra query for checking the result, and
      we can also use this to search for a specific opponent if it is requested
     */
    const opponentQuery = knex('games')
      .select('teams.name', 'games.id as game_id')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .as('opponent')
    // Check to see if we need to search for a specific opponent
    if (typeof options.opponent !== 'undefined') {
      opponentQuery.where('teams.name', '=', options.opponent)
    } else {
      opponentQuery.where('teams.name', '!=', teamName)
    }
    const gamesQuery = knex(playerQuery)
      .join(opponentQuery, 'player.game_id', '=', 'opponent.game_id')
      .select(
        'player.game_id',
        'opponent.name as opponent',
        'player.submission_id',
        'player.status',
        'player.win_reason',
        'player.version',
        'player.lose_reason',
        'player.winner_id',
        'player.log_url',
        'player.created_at',
        'player.updated_at')
      .orderBy('player.created_at', 'desc')
      .limit(pageSize).offset(offset)
    gamesQuery.then((rows) => {
      console.log(rows)
      const games = []
      for (const row of rows) {
        let game = row
        if (game.submission_id === game.winner_id) {
          game.winner = teamName
        } else {
          game.winner = game.opponent
        }
        // This will let us contact the correct endpoint to actually retrieve
        // the log url from the arena
        if (game.log_url !== null) {
          game.log_url = host + logEndpoint + game.log_url
        }
        if (game.client_log_url !== null) {
          game.client_log_url = host + logEndpoint + game.client_log_url
        }
        delete game.winner_id
        delete game.team_id
        games.push(game)
      }
      // We need to re-sort the games
      games.sort(sortGames)
      return resolve(games)
    }).catch((err) => {
      reject(err)
    })
  })
}

function countGamesByTeamName (teamName, options) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    const playerQuery = knex('games')
      .select('games.id as game_id')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', function () {
        this.on('teams.id', '=', 'submissions.team_id')
        // Checks the 'options' parameter for the result field
        if (typeof options.result !== 'undefined') {
          console.log(options)
          // If it is win then we need to check if the submission id is equal to
          // the winner id on the game
          if (options.result === 'win') {
            this.andOn('games.winner_id', '=', 'submission_id')
          } else if (options.result === 'loss') {
            this.andOn('games.winner_id', '!=', 'submission_id')
          }
        }
      })
      .where('teams.name', '=', teamName)
      // gives this sub query the alias 'player'
      .as('player')
    if (typeof options.version !== 'undefined') {
      playerQuery.andWhere('submissions.version', '=', options.version)
    }
    /*
      This sub query is just like the one above, except this will be looking for
      the opponent. It doesn't need the extra query for checking the result, and
      we can also use this to search for a specific opponent if it is requested
     */
    const opponentQuery = knex('games')
      .select('games.id as game_id')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .as('opponent')
    // Check to see if we need to search for a specific opponent
    if (typeof options.opponent !== 'undefined') {
      opponentQuery.where('teams.name', '=', options.opponent)
    } else {
      opponentQuery.where('teams.name', '!=', teamName)
    }
    const query = knex(playerQuery)
      .join(opponentQuery, 'player.game_id', '=', 'opponent.game_id')
      .count('player.game_id')
    query.then((count) => {
      resolve(parseInt(count[0].count))
    }).catch((err) => {
      reject(err)
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
  getGameById,
  countGamesByTeamName
}
