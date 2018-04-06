// Raven config file - please provide PUBLIC_KEY, {SECRET_KEY} and {PROJECT_ID} and complete the configuration

// Usage

// Import this in any js file where you would want to record errors

// as "const Raven = require('../utils/ravenconfig')""

// to record an error Raven.captureException("Error message here", { req: req })

const SENTRY_DSN = require('../vars').SENTRY_DSN

const Raven = require('raven')
Raven.config(SENTRY_DSN).install(function (err, initialErr, eventId) {
  console.error(err)
  process.exit(1)
})

module.exports = { Raven }
