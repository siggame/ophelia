const express = require('express');
const router = express.Router();
const db = require('../db/init');
const team = require('../team/init');

router.get('/team/:teamId', (req, res) => {
    console.log("params", req.params);
    db.teams.getTeam(req.params.teamId).then((data)=>{
        res.render('profile', {title:"", teamInfo:data[0]})
    }).catch((err) => {
        console.error(err);
    });
});

router.get('/team/:teamId/edit', (req, res) => {
    db.teams.getTeam(req.params.teamId).then((data) => {
        // if(data[0].name !== req.session.user) {
        //     res.redirect('/403');
        // } else {
            res.render('edit_profile', {title:"", teamInfo:data[0]})
        // }
    }).catch((err) => {
        console.error(err);
    })
});

router.post('/team/:teamId/edit', (req, res) => {
    console.log("Posted!");
    team.profile.editProfile(req.params.teamId, req.body).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = {router};