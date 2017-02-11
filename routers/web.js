const express = require('express');
const auth = require('./auth');
const needsAuthentication = auth.needsAuthentication;

const router = express.Router();

router.get("/", (req, res)=>{
  res.send("Done");
});

router.get("/dashboard", needsAuthentication, (req,res)=>{
  res.send("authed")
});

module.exports =  { router };