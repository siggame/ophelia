'use strict'

/*
    This file compiles all of the different routers into one place, so we just have to export one file
    when routers are needed.

    If you create a router inside of this directory, include it here and make sure to add it to module.exports.
    It also needs to be included inside of app.js, next to the other 'app.use' statements.
 */

const web = require('./web')
const login = require('./login')
const signup = require('./signup')
const dashboard = require('./dashboard')
const profile = require('./profile')
const error = require('./error')
const users = require('./users')
const submissions = require('./submissions')

module.exports = {
  submissions,
  users,
  web,
  login,
  signup,
  dashboard,
  profile,
  error
}
