"use strict";

const express = require('express');
const router = express.Router();

// Handle GET requests for the Sign Up page
router.get("/signup", (req, res)=> {
    res.render('signup', {title:"MegaminerAI - Sign Up"});
});

module.exports = {router};