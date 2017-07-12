"use strict";

const express = require('express');
const validate = require('../session/validate');
const router = express.Router();

// Handle GET requests for the Login page
router.get('/dashboard', validate.requireLogin,(req, res)=>{
    res.render('dashboard', {title: "MegaminerAI - Your Dashboard", user: req.session.user})
});

module.exports = {router};