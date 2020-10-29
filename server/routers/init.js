'use strict'

/*
    This file compiles all of the different routers into one place, so we just have to export one file
    when routers are needed.

    If you create a router inside of this directory, include it here and make sure to add it to module.exports.
    It also needs to be included inside of app.js, next to the other 'app.use' statements.
 */

const users = require('./users')
const submissions = require('./submissions')
const games = require('./games')
const login = require('./login')
const medium = require('./medium')
const admin = require('./admin')
const teams = require('./teams')
const invites = require('./invites')
const stats = require('./stats')
const api = require('./api');

module.exports = {
  admin,
  games,
  submissions,
  users,
  login,
  medium,
  teams,
  invites,
  stats,
  api
}
