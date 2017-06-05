"use strict";

const express = require('express');
const router = express.Router();

// Handle GET requests for the Login page
router.get('/login', (req, res)=>{
    res.render('login');
});

module.exports = {router};
