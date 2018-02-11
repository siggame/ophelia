import axios from 'axios'
import { action, computed, observable, reaction } from 'mobx'

export class AuthStore {
  @observable username = ''
  @observable token = window.localStorage.getItem('jwt')

  constructor () {
    // Updates or removes our JSON Web Token in the localStorage of the browser.1
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token)
        } else {
          window.localStorage.removeItem('jwt')
        }
      }
    )
  }

  @computed get isUserLoggedIn () {
    return !!(this.token)
  }

  @action setToken(token) {
    this.token = token
  }

  @action setUsername(username) {
    this.username = username
  }

  @action logUserIn (username, password) {
    return new Promise(action('login-callback', (resolve, reject) => {      axios.post('/login',
        {
          username: username,
          password: password
        }
      ).then((response) => {
        this.setToken(response.data.token)
        this.username = username
        return resolve()
      }).catch((err) => {
        // TODO: Error handling
        console.log('Axios Error - Auth Store')
        return reject(err)
      })
    }))
  }

  @action logUserOut () {
    this.username = ''
    this.token = ''
  }
}

export default new AuthStore()
