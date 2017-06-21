"use strict";

const express = require('express');
const router = express.Router();

// Handle GET requests for the Login page
router.get('/dashboard', (req, res)=>{
    res.render('dashboard', {
        title: "Your Dashboard - MegaminerAI"
    });
});

module.exports = {router};