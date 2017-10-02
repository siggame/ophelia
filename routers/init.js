'use strict'

/*
    This file compiles all of the different routers into one place, so we just have to export one file
    when routers are needed.

    If you create a router inside of this directory, include it here and make sure to add it to module.exports.
    It also needs to be included inside of app.js, next to the other 'app.use' statements.
 */

// const web = require('./old_routers/web')
// const login = require('./old_routers/login')
// const signup = require('./old_routers/signup')
// const dashboard = require('./old_routers/dashboard')
// const profile = require('./old_routers/profile')
// const error = require('./old_routers/error')
const users = require('./users')
const submissions = require('./submissions')
const games = require('./games')
const signin = require('./signin')

module.exports = {
  games,
  submissions,
  users,
  signin
  // web,
  // login,
  // signup,
  // dashboard,
  // profile,
  // error
}
