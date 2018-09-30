'use strict'

const teams = require('./teams')
const submissions = require('./submissions')
const games = require('./games')
const users = require('./users')
const invites = require('./invites')

module.exports = {
  users,
  teams,
  submissions,
  games,
  invites
}
