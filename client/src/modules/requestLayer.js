import axios from 'axios'

import authStore from '../stores'

export default class RequestLayer {
  fetchGames () {
    return new Promise((resolve, reject) => {
      // Check first to make sure the user is logged in
      // if (!authStore.isUserLoggedIn) {
      //   return reject(new Error('User must be logged in to fetch games'))
      // }
      axios.get('/games/', {
        // headers: {
        //   Authorization: `Bearer ${authStore.token}`
        // }
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
}
