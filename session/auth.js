'use strict'

const CryptoJS = require('crypto-js')
const uuid4 = require('uuid/v4')

// TODO This NEEDS to be in a secret config, not plaintext
const AESsecret = '7661e1bf-af31-4306-8472-ea6d3702aa79'

function encrypt (pass) {
  const salt = uuid4()
  const epass = CryptoJS.AES.encrypt(pass, AESsecret + salt)
  return {
    epass: epass.toString(),
    salt: salt
  }
}

function decrypt (epass, salt) {
  const pass = CryptoJS.AES.decrypt(epass, AESsecret + salt)
  return pass.toString(CryptoJS.enc.Utf8)
}

module.exports = {
  encrypt,
  decrypt
}

const stuff = encrypt('test')
console.log(stuff)
const pass = decrypt(stuff.epass, stuff.salt)
console.log(pass)
