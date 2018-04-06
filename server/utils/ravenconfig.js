const SENTRY_DSN = require('../vars').SENTRY_DSN

const Raven = require('raven')
Raven.config(SENTRY_DSN).install(function (err, initialErr, eventId) {
  console.error(err)
  process.exit(1)
})

function info (message) {
  Raven.captureMessage(message, {
    level: 'info'
  })
}

function debug (message) {
  Raven.captureMessage(message, {
    level: 'debug'
  })
}

function error (err) {
  Raven.captureException(err)
}

function warn (message) {
  Raven.captureMessage(message, {
    level: 'warn'
  })
}

module.exports = { info, debug, error, warn }
