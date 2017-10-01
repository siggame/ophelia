'use strict'

const usernameMinLen = 6
const usernameRegex = /\w*/
// One uppercase, one lowercase, one number, 8 characters long
const passRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/

function checkUsername (username) {
  let valid = false
    // Check if there a semicolon to sanitize
  if (username.includes(';')) {
    valid = false
  } else if (username.length >= usernameMinLen &&
        username.match(usernameRegex) !== null) {
    valid = true
  }
  return valid
}

function checkPassword (password) {
    // TODO ; use regex to check for password validity
  let valid = false
    // Check if there a semicolon to sanitize
  if (password.includes(';')) {
    valid = false
  } else if (password.match(passRegex) !== null) {
    valid = true
  }
  return valid
}

function validate (username, password) {
  let valid = false
  console.log('checkUsername', checkUsername(username))
  console.log('checkPassword', checkPassword(password))

  if (checkUsername(username) && checkPassword(password)) {
    valid = true
  }

  return valid
}

function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/login')
  } else {
    console.log('User Session Key', req.session.user)
    next()
  }
}

module.exports = {
  validate: validate,
  requireLogin: requireLogin
}
