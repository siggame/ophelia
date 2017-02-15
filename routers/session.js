"use strict";

const express = require('express');
const session = require('express-session');

const router = express.Router();

router.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

module.exports = { router };
