import axios from 'axios'

import stores from '../stores'

export default class RequestLayer {
  fetchGames () {
    return new Promise((resolve, reject) => {
      // Check first to make sure the user is logged in
      if (!stores.authStore.isUserLoggedIn) {
        return reject(new Error('User must be logged in to fetch games'))
      }
      axios.get('/games/', {
        headers: {
          Authorization: `Bearer ${stores.authStore.token}`
        },
        params: {
          page: 1
        }
      }).then((response) => {
        return resolve(response.data.games)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  fetchSubmissions () {
    return new Promise((resolve, reject) => {
      // Check first to make sure the user is logged in
      if (!stores.authStore.isUserLoggedIn) {
        return reject(new Error('User must be logged in to fetch games'))
      }
      axios.get('/submissions/', {
        headers: {
          Authorization: `Bearer ${stores.authStore.token}`
        },
        params: {
          page: 1
        }
      }).then((response) => {
        return resolve(response.data.submissions)
      }).catch((err) => {
        return reject(err)
      })
    })
  }
}
