'use strict'

const CryptoJS = require('crypto-js')
const uuid4 = require('uuid/v4')

const AESsecret = require('../vars').PASSWORD_SECRET

const maxIter = 10000
const minIter = 4000

/**
 * This function takes the password given by the user, generates a salt and
 * random number to use for hashing, and encrypts the password and returns the
 * generated values to store when decrypting
 * @param pass password to be encrypted
 * @return {{epass: string, salt: string, iterations: number}}
 */
function encrypt (pass) {
  const salt = uuid4()
  const iterations = Math.floor(Math.random() * (maxIter - minIter) + minIter)
  const hashes = hasher(pass, salt, iterations)
  const secret = CryptoJS.SHA512(AESsecret + hashes.salt).toString()
  const epass = CryptoJS.AES.encrypt(hashes.pass, secret)
    .toString()
  return {
    epass,
    salt,
    iterations
  }
}

/**
 * Function to use when wanting to know if the given password matches the
 * encrypted password in the database
 * @param epass stored encrypted password
 * @param pass password supplied by the user
 * @param salt stored salt used for encryption
 * @param iterations stored iterations number used for encryption
 * @return {boolean} returns whether or not the password matches
 */
function compare (epass, pass, salt, iterations) {
  const hashes = hasher(pass, salt, iterations)
  const dpass = decrypt(epass, hashes.salt)
  return hashes.pass === dpass
}

/**
 * Decrypts the passwod with the given salt using the secret key
 * @param epass password to be decrypted
 * @param salt salt to be used for decryption
 * @return {string, null} returns either decrypted password on success
 *    and null if it does not decrypt properly
 */
function decrypt (epass, salt) {
  const secret = CryptoJS.SHA512(AESsecret + salt).toString()
  const pass = CryptoJS.AES.decrypt(epass, secret)
  try {
    return pass.toString(CryptoJS.enc.Utf8)
  } catch (err) {
    if (err.message === 'Malformed UTF-8 data') {
      return null
    }
    throw new Error(err)
  }
}

/**
 * Implements the PBKDF2 hashing algorithm using a salt and a random number
 * of iterations for the algorithm to hash through
 * @param pass
 * @param salt
 * @param iterations
 * @return {{pass: string, salt: string}}
 */
function hasher (pass, salt, iterations) {
  const pbkdf2Options = {
    keySize: 512 / 16,
    iterations: iterations
  }
  const hash = CryptoJS.PBKDF2(pass, salt, pbkdf2Options).toString()
  return {
    pass: hash.slice(0, 127),
    salt: hash.slice(127, 256)
  }
}

module.exports = {
  encrypt,
  compare
}
