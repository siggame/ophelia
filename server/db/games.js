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
      Here we join all the tables together to get a list of ids from
      the games table that we will use in the next query.
      We then limit how many rows we are getting by created_at,
      and then limiting them to one pageSize worth of games,
      offset to the specific page we want.
      We also use this to get the version number of the submission
      that the given teamName submitted.
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
        if (typeof options.result !== 'undefined') {
          if (options.result === 'win') {
            this.andOn('games.winner_id', '=', 'submission_id')
          } else if (options.result === 'loss') {
            this.andOn('games.winner_id', '!=', 'submission_id')
          }
        }
      })
      .where('teams.name', '=', teamName)
      .as('player')
    if (typeof options.version !== 'undefined') {
      playerQuery.andWhere('submissions.version', '=', options.version)
    }
    const opponentQuery = knex('games')
      .select('teams.name', 'games.id as game_id')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .as('opponent')
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
        // This finds the version number of the teamName we searched for
        // By using the array we made earlier to store them together
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

function countGamesByTeamName (teamName) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('TeamName is null or undefined'))
    }
    const query = knex('games')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions',
        'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .where('teams.name', '=', teamName)
      .count('games.id')
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
