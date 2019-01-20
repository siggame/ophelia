'use strict'

const _ = require('lodash')

module.exports = {
  DB_HOST: _.defaultTo(process.env.DB_HOST, 'localhost'),
  DB_PORT: _.defaultTo(process.env.DB_PORT, 5432),
  DB_USER: _.defaultTo(process.env.DB_USER, 'postgres'),
  DB_PASS: _.defaultTo(process.env.DB_PASS, ''),
  DB_CLIENT: _.defaultTo(process.env.DB_CLIENT, 'pg'),
  DB_NAME: _.defaultTo(process.env.DB_NAME, 'postgres'),
  HOST: _.defaultTo(process.env.HOST, 'localhost'),
  SERVER_HOST: _.defaultTo(process.env.SERVER_HOST, 'localhost'),
  PORT: _.defaultTo(process.env.PORT, 3001),
  PASSWORD_SECRET: _.defaultTo(process.env.PASSWORD_SECRET, 'secret'),
  SENTRY_DSN: _.defaultTo(process.env.SENTRY_DSN, 'null'),
  TOKEN_SECRET: _.defaultTo(process.env.TOKEN_SECRET, 'token_secret'),
  TOKEN_EXPIRE_TIME: _.defaultTo(process.env.TOKEN_EXPIRE_TIME, '1d'),
  MAX_FILE_SIZE: _.defaultTo(process.env.MAX_FILE_SIZE, '50000'),
  ARENA_HOST: _.defaultTo(process.env.ARENA_HOST, 'localhost'),
  SUBMISSIONS_ENDPOINT: _.defaultTo(process.env.SUBMISSIONS_ENDPOINT, '/tmp'),
  LOG_ENDPOINT: _.defaultTo(process.env.LOG_ENDPOINT, '/tmp'),
  ELIGIBLE_DEFAULT: _.defaultTo(process.env.ELIGIBLE_DEFAULT, false),
  LANGUAGES: ['cs', 'cpp', 'java', 'js', 'py', 'lua']
}
