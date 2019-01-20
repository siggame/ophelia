'use strict'

const teams = require('./teams')
const submissions = require('./submissions')
const games = require('./games')
const users = require('./users')
const invites = require('./invites')
const stats = require('./stats')

module.exports = {
  users,
  teams,
  submissions,
  games,
  invites,
  stats
}
