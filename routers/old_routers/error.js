const express = require('express')
const router = express.Router()

router.get('/:errorId', (req, res) => {
  let error = ''
  switch (req.params.errorId) {
    case '404':
      error = '404 - Not Found'
      break
    case '403':
      error = '403 - Not Authorized'
      break
    case '500':
      error = '500 - Internal Server Error'
      break
    default:
      error = 'Uh-oh, something broke!'
      break
  }

  res.render('error', { title: '', error: error })
})

module.exports = {router}
