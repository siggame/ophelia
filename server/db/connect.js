'use strict'

const vars = require('../vars')

const knex = require('knex')({
  client: vars.DB_CLIENT,
  connection: {
    host: vars.DB_HOST,
    port: vars.DB_PORT,
    user: vars.DB_USER,
    password: vars.DB_PASS,
    database: vars.DB_NAME
  }
})

module.exports = {
  knex
}
