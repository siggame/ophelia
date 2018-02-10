import { observable } from 'mobx'
import axios from 'axios'

export default class AuthStore {
  constructor () {
    this.token = ''
    this.username = ''
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
