// Raven config file - please provide PUBLIC_KEY, {SECRET_KEY} and {PROJECT_ID} and complete the configuration

						//Usage 

// Import this in any js file where you would want to record errors

// as "const Raven = require('../utils/ravenconfig')""

// to record an error Raven.captureException("Error message here", { req: req })

const Raven = require('raven');
Raven.config('https://{PUBLIC_KEY}:{SECRET_KEY}@sentry.io/{PROJECT_ID}').install(function (err, initialErr, eventId) {
  console.error(err);
  process.exit(1);
});

module.exports = Raven