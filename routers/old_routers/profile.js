const express = require('express')
const router = express.Router()
const db = require('../../db/init')
const team = require('../../team/init')

router.get('/team/:teamId', (req, res) => {
  console.log('params', req.params)
  db.teams.getTeam(req.params.teamId).then((data) => {
    let editPermission = data[0].name === req.session.user
    res.render('profile', {title: '',
      teamInfo: data[0],
      editPermission: editPermission,
      user: req.session.user
    })
  }).catch((err) => {
    console.error(err)
  })
})

router.get('/team/:teamId/edit', (req, res) => {
  db.teams.getTeam(req.params.teamId).then((data) => {
    if (data[0].name !== req.session.user) {
      res.redirect('/403')
    } else {
      res.render('edit_profile', { title: '', teamInfo: data[0], errorObject: {} })
    }
  }).catch((err) => {
    console.error(err)
  })
})

router.post('/team/:teamId/edit', (req, res) => {
  team.profile.editProfile(req.params.teamId, req.body).then(() => {
    // TODO: Get this actually working (redirect back to dashboard)
    if (req.params.source === 'dashboard') {
      res.redirect('/dashboard')
    } else {
      res.redirect('/team/' + req.params.teamId)
    }
  }).catch((errorObject) => {
    db.teams.getTeam(req.params.teamId).then((teamInfo) => {
      res.render('edit_profile', {title: '', teamInfo: teamInfo[0], errorObject: errorObject})
    }).catch((err) => {
      console.error('Getting Team Data failed - POST:/team/' + req.params.teamId + '/edit', err)
      res.redirect('/500')
    })
  })
})

module.exports = {router}
