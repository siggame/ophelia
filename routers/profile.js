const express = require('express');
const router = express.Router();
const teams = require('../db/teams');

router.get('/team/:teamId', (req, res) => {
    console.log("params", req.params);
    teams.getTeam(req.params.teamId).then((data)=>{
        res.render('profile', {title:"", teamInfo:data[0]})
    }).catch((err) => {
        console.error(err);
    });
});

router.get('/team/:teamId/edit', (req, res) => {
    teams.getTeam(req.params.teamId).then((data) => {
        if(data[0].name !== req.session.user) {
            res.redirect('/403');
        } else {
            res.render('edit_profile', {title:"", teamInfo:data[0]})
        }
    }).catch((err) => {
        console.error(err);
    })
});

module.exports = {router};