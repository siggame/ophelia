import axios from 'axios'
import { action, computed, observable, reaction } from 'mobx'
import jwtDecode from 'jwt-decode'

import gameStore from './games'
import submissionStore from './submissions'

export class AuthStore {
  @observable token = localStorage.getItem('jwt')

  constructor () {
    // Updates or removes our JSON Web Token in the localStorage of the browser.1
    reaction(
      () => this.token,
      token => {
        if (token) {
          localStorage.setItem('jwt', token)
        } else {
          localStorage.removeItem('jwt')
        }
      }
    )
  }

  /**
   * @description Get username from user's jwt token
   * @return {string | null} username if jwt token is valid. Otherwise, null
   */
  @computed get username () {
    try {
      const { username } = jwtDecode(this.token)
      return username
    } catch (err) {
      return null
    }
  }

  /**
   * @description Decode token and validate user's authentication
   * @return {boolean} True if user has a valid token. Otherwise, false
   */
  @computed get isUserLoggedIn () {
    try {
      const { exp } = jwtDecode(this.token)

      if (this.isTokenExpired(exp)) {
        return false
      }
    } catch (err) {
      return false
    }

    return true
  }

  @action setToken (token) {
    this.token = token
  }

  @action logUserIn (username, password) {
    return new Promise(action('login-callback', (resolve, reject) => {
      axios.post('/login',
        {
          username: username,
          password: password
        }
      ).then((response) => {
        this.setToken(response.data.token)
        return resolve()
      }).catch((err) => {
        // TODO: Error handling
        console.log('Axios Error - Auth Store')
        return reject(err)
      })
    }))
  }

  @action logUserOut () {
    this.token = ''
    gameStore.resetGameData()
    submissionStore.resetSubmissionData()
  }

  /**
   * @description Check whether or not the token is expired
   * @param {number} exp Value in UTC seconds when token expires
   * @return {boolean} Whether or not the token has expired compared to the current time
   */
  isTokenExpired (exp) {
    if (!exp) {
      return false
    }
    return new Date().getTime() / 1000 > exp
  }
}

export default new AuthStore()
