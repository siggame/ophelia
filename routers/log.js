"use strict";

const express = require('express');
const qs = require('querystring');

const router = express.Router();

router.use("/", (req, res, next)=>{
  console.log(`Request: ${req.method} - ${req.path} ?${qs.stringify(req.query)}`);
  next();
});

module.exports = { router };
