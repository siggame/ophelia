'use strict'

const _ = require('lodash')

module.exports = {
  HOST: _.defaultTo(process.env.HOST, 'localhost'),
  PORT: _.defaultTo(process.env.PORT, 3000),
  DB_HOST: _.defaultTo(process.env.DB_HOST, 'localhost'),
  DB_PORT: _.defaultTo(process.env.DB_PORT, 32768),
  DB_USER: _.defaultTo(process.env.DB_USER, 'docker'),
  DB_PASS: _.defaultTo(process.env.DB_PASS, 'docker'),
  DB: _.defaultTo(process.env.DB, 'mmai')

}
