import axios from 'axios'
import { action, computed, observable, reaction, toJS, autorun, extendObservable } from 'mobx'
import jwtDecode from 'jwt-decode'

import gameStore from './games'
import submissionStore from './submissions'

/**
 * @description If the value of any observables change, save the new values in localStorage. Does not save on initial load
 * @param {any} store Any instance of a store
 * @param {function} save Function that will save store values in localStorage
 */
function autoSave (store, save) {
  let firstRun = true;
  autorun(() => {
    // This code will run every time any observable property
    // on the store is updated.
    const json = JSON.stringify(toJS(store));
    if (!firstRun) {
      save(json);
    }
    firstRun = false;
  })
}

export class AuthStore {
  @observable username = ''
  @observable token = ''

  constructor () {
    // Removes the auth JSON value in localStorage if the user is no longer logged in
    reaction(
      () => this.isUserLoggedIn,
      isUserLoggedIn => {
        if (!isUserLoggedIn) {
          localStorage.removeItem('auth')
        }
      }
    )

    this.loadUser();
    autoSave(this, this.save)
  }

  /**
   * @description Decode token and validate user's authentication
   * @return {boolean} True if user has a valid token. Otherwise, false
   */
  @computed get isUserLoggedIn () {
    try {
      const { exp, username } = jwtDecode(this.token)

      if (this.isTokenExpired(exp) || this.username !== username) {
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

  @action setUsername (username) {
    this.username = username
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

  /**
   * @description Get and update values of the auth store in localStorage
  */
  loadUser () {
    const auth = localStorage.getItem('auth');
    if (auth) {
      extendObservable(this, JSON.parse(auth));
    }
  }

  /**
   * @description Save the JSON value of the store in localStorage
   * @param {string} json stringified JSON object of the store
   */
  save = (json) => {
    localStorage.setItem('auth', json)
  }
}

export default new AuthStore()
