import axios from 'axios'
import { action, computed, observable, reaction, runInAction } from 'mobx'
import jwtDecode from 'jwt-decode'

import gameStore from './games'
import submissionStore from './submissions'
import RequestLayer from '../modules/requestLayer'

export class AuthStore {
  @observable token = window.localStorage.getItem('jwt')
  @observable user
  @observable errors = undefined

  constructor () {
    this.requestLayer = new RequestLayer()

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
   * @description Get username from user's jwt token
   * @return {number | null} id if jwt token is valid. Otherwise, null
   */
  @computed get userId () {
    try {
      const { id } = jwtDecode(this.token)
      return id
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
      axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password
      })
        .then((response) => {
          this.setToken(response.data.token)
          return resolve()
        })
        .then(() => this.requestLayer.getCurrentUser())
        .then((response) => {
          this.user = response.data.user
          return resolve()
        })
        .catch((err) => {
          // TODO: Error handling
          console.log('Axios Error - Auth Store')
          return reject(err)
        })
    }))
  }

  @action async getCurrentUser () {
    try {
      const response = await this.requestLayer.getCurrentUser()
      runInAction(() => {
        this.user = response.data.user
      })
    } catch (err) {
      console.log(err)
    }
  }

  @action async updateUser (oldPassword, email, name, password) {
    try {
      const response = await this.requestLayer.updateUserProfile(oldPassword, email, name, password)
      runInAction(() => {
        this.user = {
          ...this.user,
          contactEmail: email,
          contactName: name
        }
      })

      return response.data
    } catch (err) {
      runInAction(() => {
        this.errors = err.response.data
      })
    }
  }

  @action logUserOut () {
    this.token = ''
    this.user = undefined
    this.clearErrors()
    gameStore.resetGameData()
    submissionStore.resetSubmissionData()
  }

  @action clearErrors () {
    this.errors = undefined
  }

  /**
   * @description Check whether or not the token is expired
   * @param {number} exp Value in UTC seconds when token expires
   * @return {boolean} Whether or not the token has expired compared to the current time
   */
  isTokenExpired (exp) {
    if (!exp) {
      return true
    }
    return new Date().getTime() / 1000 > exp
  }
}

export default new AuthStore()
