'use strict'

const knex = require('./connect').knex

function getTeamWinCounts () {
  return new Promise((resolve, reject) => {
    const winCounts = []
    const statsQuery = knex('games')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions', function () {
        this.on('submissions.id', '=', 'games_submissions.submission_id')
          .andOn('games.winner_id', '=', 'games_submissions.submission_id')
      })
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .select('teams.name')
      .count('games.winner_id').as('count')
      .groupBy('teams.name')
    statsQuery.then((rows) => {
      rows.forEach((row) => {
        winCounts.push({
          teamName: row.name,
          winCount: row.count
        })
      })
      return resolve(winCounts)
    }).catch((err) => {
      return reject(err)
    })
  })
}

function getTeamsWins (teamName, options) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('teamName is null or undefined'))
    }
    const gameIDs = []
    const versions = []
    const winsPerOpponent = []

    const gamesQuery = knex('games')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions', 'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .where('teams.name', '=', teamName)
      .select('games.id', 'games.created_at', 'games.updated_at',
        'submissions.version')
      .orderBy('games.created_at', 'desc')
    gamesQuery.then((rows) => {
      rows.forEach((row) => { gameIDs.push(row.id) })
      rows.forEach((row) => {
        versions.push({
          gameID: row.id,
          version: row.version
        })
      })
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
        const statsAgainstTeam = {}
        for (const row of subRows) {
          let ver = versions.find(o => o.gameID === row.id)
          // if the version number is defined only add games that were ran on that version
          if (typeof options.version !== 'undefined') {
            if (ver.version !== options.version) {
              continue
            }
          }
          // check if the team we are looking at is already in the dict
          if (!(row.name in statsAgainstTeam)) {
            statsAgainstTeam[row.name] = {
              wins: 0,
              losses: 0
            }
          }
          // count the wins and losses against each team
          if (row.team_id !== row.winner_id) {
            statsAgainstTeam[row.name].wins += 1
          } else {
            statsAgainstTeam[row.name].losses += 1
          }
        }
        // get the name and stats for each opponent and turn them into an array
        for (const key in statsAgainstTeam) {
          if (statsAgainstTeam.hasOwnProperty(key)) {
            winsPerOpponent.push({
              name: key,
              stats: statsAgainstTeam[key]
            })
          }
        }
        return resolve(winsPerOpponent)
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

function getWinLossRatio(teamName, options) {
  return new Promise((resolve, reject) => {
    if (teamName === null || typeof teamName === 'undefined') {
      reject(new Error('teamName is null or undefined'))
    }
    const winLossRatio = {
      wins: 0,
      losses: 0
    }

    const winLossRatioQuery = knex('games')
      .join('games_submissions', 'games_submissions.game_id', '=', 'games.id')
      .join('submissions', 'submissions.id', '=', 'games_submissions.submission_id')
      .join('teams', 'teams.id', '=', 'submissions.team_id')
      .where('teams.name', '=', teamName)
      .select('games.id', 'games.winner_id', 'submissions.version', 'submissions.team_id')

    winLossRatioQuery.then((rows) => {
      for (const row of rows) {
        if (typeof options.version !== 'undefined') {
          if (row.version !== options.version) {
            continue
          }
        }
        if (row.winner_id === row.team_id) {
          winLossRatio.wins += 1
        } else {
          winLossRatio.losses += 1
        }
      }
      winLossRatio.totalGames = winLossRatio.wins + winLossRatio.losses
      winLossRatio.winRatio = winLossRatio.wins / winLossRatio.totalGames
      return resolve(winLossRatio)
    }).catch((err) => {
      return reject(err)
    })
  })
}

module.exports = {
  getTeamWinCounts,
  getTeamsWins,
  getWinLossRatio
}
