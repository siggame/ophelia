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
  parser.parseURL(mediumFeed, (err, parsed) => {
    if (typeof err !== 'undefined' && err !== null) {
      console.log('uh oh', err)
      res.status(500).send('uh oh')
    } else {
      res.status(200).json(parsed)
    }
  })
})

module.exports = { router }
