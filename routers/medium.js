const express = require('express')
const router = express.Router()
const parser = require('rss-parser')

const path = '/medium'

const mediumFeed = 'http://medium.com/feed/siggame'

/**
 * GET '/medium/' - gets the 5 newest posts from the SIG-Game Medium page.
 * Posts include: title, desc, link, url, created
 */
router.get(path + '/', (req, res) => {
  const response = {
    success: false,
    message: '',
    entries: null
  }
  try {
    parser.parseURL(mediumFeed, (err, parsed) => {
      if (typeof err !== 'undefined' && err !== null) {
        console.log('uh oh', err)
        response.success = false
        // TODO Log error instead of responding with it
        response.message = err.message
        res.status(500).json(response)
      } else {
        response.success = true
        response.entries = parsed.feed.entries.slice(0, 5)
        res.status(200).json(response)
      }
    })
  } catch (err) {
    // TODO Log this instead of responding with it
    response.message = err.message
    res.status(500).json(response)
  }
})

module.exports = { router }
