"use strict";

const express = require('express');
const router = express.Router();
const signup = require('../session/signup');

// Handle GET requests for the Sign Up page
router.get("/signup", (req, res)=> {
    if(req.session.user) {
        // If a user is logged in, they shouldn't need to signup
        res.redirect('/');
    } else {
        res.render('signup', {title: "MegaminerAI - Sign Up"});
    }
});

router.post("/signup", (req, res)=> {
    let formData = req.body;
    console.log("formData", formData);
    signup.createUser(formData.group_name, formData.password, formData.name, formData.email, true).then((success)=>{
        res.redirect('/');
    }, (err) => {
        console.log("something wrong", err);
        res.redirect('/signup');
    })

});

module.exports = {router};