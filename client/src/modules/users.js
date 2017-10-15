import axios from 'axios'
import validate from 'validate.js'

export function validateSignup(username, name, email, password, confirmPassword) {
  return new Promise((resolve, reject) => {
    let formData = {
      username: username,
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    }
    const constraints = {
      username: {
        presence: true,
        format: {
          pattern: /(\w)+/,
          message: 'can only contain alphanumerics and _'
        },
        length: {
          minimum: 4,
          maximum: 32,
          message: 'must be between 4 and 32 characters'
        }
      },
      name: {
        presence: true
      },
      email: {
        presence: true,
        email: true
      },
      password: {
        presence: true,
        length: {
          minimum: 6,
          message: 'must be at least 6 characters'
        }
      },
      confirmPassword: {}
    }

    let errors = validate(formData, constraints)
    if(password !== confirmPassword) {
      // If the mismatched passwords is the only error, then we need to make the error object not undefined
      if (typeof errors === 'undefined') {
        errors = {}
      }
      errors.confirmPassword = [ 'Passwords must match' ]
    }
    if(errors) {
      return reject(errors)
    } else {
      axios.post('/users', {
        username: username,
        password: password,
        email: email
      }).then((data) => {
        return resolve(data)
      }).catch((err)=> {
        return reject(err)
      })

    }
  })
}

export function validateLogin(username, password) {
  return new Promise((resolve, reject) => {
    axios.post('/login', {
      username: username,
      password: password
    }).then((data) => {
      return resolve(data)
    }).catch((err) => {
      return reject(err)
    })

  })
}