const SENTRY_DSN = require('../vars').SENTRY_DSN

const Raven = require('raven')
try {
  Raven.config(SENTRY_DSN).install(function (err, initialErr, eventId) {
    console.error(err)
    process.exit(1)
  })
} catch (err) {
  if (process.env.NODE_ENV === 'production') {
    throw err
  }
}

function info (message, context) {
  const options = {
    level: 'info'
  }
  if (typeof context !== 'undefined') {
    options.extra = context
  }
  Raven.captureMessage(message, options)
}

function debug (message, context) {
  const options = {
    level: 'debug'
  }
  if (typeof context !== 'undefined') {
    options.extra = context
  }
  Raven.captureMessage(message, options)
}

function error (err, context) {
  const options = {}
  if (typeof context !== 'undefined') {
    options.extra = context
  }
  Raven.captureException(err, options)
}

function warn (message, context) {
  const options = {
    level: 'warn'
  }
  if (typeof context !== 'undefined') {
    options.extra = context
  }
  Raven.captureMessage(message, options)
}

module.exports = { info, debug, error, warn }
