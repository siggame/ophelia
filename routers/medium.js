const express = require('express')
const router = express.Router()
const feed = require('rss-to-json')

const path = '/medium'

/**
 * GET '/medium/' - gets the 5 newest posts from the SIG-Game Medium page.
 * Posts include: title, desc, link, url, created
 */
router.get(path + '/', (req, res) => {
  feed.load('https://www.medium.com/feed/siggame', (err, rss) => {
    if (err) {
      res.status(500).json({
        success: false,
        err: err,
        data: []
      })
    } else {
      console.log(rss)
      res.status(200).json({
        success: true,
        data: rss.items.slice(0, 5)
      })
    }
  })
})

module.exports = { router }
