const express = require('express');
const vars = require('../vars');
const request = require('request');
const qs = require('querystring');
const _ = require('lodash');

const router = express.Router();

router.get("/authorize", (req, res, next)=>{
  const qstr = qs.stringify({
    client_id: vars.GITLAB_ID,
    redirect_uri: `http://${vars.HOST}:${vars.PORT}/auth/callback`,
    response_type: "code"
  });
  const url = `http://${vars.GITLAB_HOST}:${vars.GITLAB_PORT}/oauth/authorize?${qstr}`;
  res.redirect(url);
});

router.get("/callback", (req, res, next)=>{
  const code = req.query.code;
  const data = {
    client_id: vars.GITLAB_ID,
    client_secret: vars.GITLAB_SECRET,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: `http://${vars.HOST}:${vars.PORT}/auth/callback`
  };
  const url = `http://${vars.GITLAB_HOST}:${vars.GITLAB_PORT}/oauth/token`;
  request.post({url: url, formData: data, json: true}, (err, httpResponse, body)=>{
    if(err) {
      return res.send(400);
    }

    req.session.gitlabToken = body.access_token;

    const url = `http://${vars.HOST}:${vars.PORT}/dashboard`;
    res.redirect(url);
  });
});

function needsAuthentication(req, res, next) {
  if(req.session.gitlabToken == null) {
    return res.redirect("/auth/authorize");
  }

  next();
}

module.exports =  {
  router,
  needsAuthentication
};