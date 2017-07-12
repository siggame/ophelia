"use strict";

const express = require('express');
const router = express.Router();

router.get("/", (req, res)=>{
  res.render("index", {title: "MegaminerAI", user: req.session.user});
});

module.exports =  {router};