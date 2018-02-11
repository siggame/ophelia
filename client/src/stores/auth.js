import axios from 'axios'
import { extendObservable } from 'mobx'

export default class AuthStore {
  constructor () {
    extendObservable(this, {
      token: '',
      username: '',
      get isUserLoggedIn () {
        return !!(this.username && this.token)
      }
    })
  }

  logUserIn (username, password) {
    return new Promise((resolve, reject) => {
      axios.post('/login',
        {
          username: username,
          password: password
        }
      ).then((response) => {
        this.token = response.data.token
        this.username = username
        return resolve()
      }).catch((err) => {
        // TODO: Error handling
        console.log('Axios Error - Auth Store')
        return reject(err)
      })
    })
  }

  logUserOut () {
    this.username = ''
    this.token = ''
  }
}
