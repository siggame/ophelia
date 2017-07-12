"use strict";

/*
    This file compiles all of the different routers into one place, so we just have to export one file
    when routers are needed.

    If you create a router inside of this directory, include it here and make sure to add it to module.exports.
 */

const web = require('./web');
const login = require('./login');
const signup = require('./signup');
const dashboard = require('./dashboard');

module.exports = { web, login, signup, dashboard };