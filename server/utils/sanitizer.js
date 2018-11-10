'use strict'

const validator = require('validator')

const usernameRegex = /^[a-zA-Z0-9_']+$/
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]*$/
// changed the regex as below was not working
// const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]$/

const teamRegex = /[a-zA-Z0-9$_+!*'()]+$/

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const emailMinLength = 5
const emailMaxLength = 100
const usernameMinLength = 4
const usernameMaxLength = 50
const passwordMinLength = 8
const passwordMaxLength = 50

/**
 * Function to check if the length of a string in certain range
 * @param str String to check
 * @param minLen Minimum possible length of the string
 * @param maxLen Maximum possible length of the string
 * @returns {boolean}
 */
function checkLength (str, minLen, maxLen) {
  return !!validator.isLength(str, {min: minLen, max: maxLen})
}

/**
 * Function to check if a email is valid
 * @param email Email to check
 * @returns {boolean}
 */
function isValidEmail (email) {
  return !!(checkLength(email, emailMinLength, emailMaxLength) && validator.matches(email, emailRegex))
}

/**
 * Function to check if a username is valid
 * @param username Username to check
 * @returns {boolean}
 */
function isValidUsername (username) {
  return !!(checkLength(username, usernameMinLength, usernameMaxLength) && validator.matches(username, usernameRegex))
}

/**
 * Function to check if a team name is valid
 * @param teamName Team name to check
 * @returns {boolean}
 */
function isValidTeamName (teamName) {
  return !!(checkLength(teamName, usernameMinLength, usernameMaxLength) && validator.matches(teamName, teamRegex))
}

/**
 * Function to check if a password is valid
 * @param password Password to check
 * @returns {boolean}
 */
function isValidPassword (password) {
  return !!(checkLength(password, passwordMinLength, passwordMaxLength) && validator.matches(password, passwordRegex))
}

/**
 * Function to check if a username and password combination is correct
 * @param username Username to check
 * @param password Password to check
 * @returns {boolean}
 */
function isValidLogin (username, password) {
  return !!(isValidUsername(username) && isValidPassword(password))
}

module.exports = {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidLogin,
  checkLength,
  isValidTeamName
}
