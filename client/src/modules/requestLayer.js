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
        return reject(new Error('User must be logged in to fetch submissions'))
      }
      axios.get('/submissions/', {
        headers: {
          Authorization: `Bearer ${stores.authStore.token}`
        }
      }).then((response) => {
        return resolve(response.data.submissions)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  uploadSubmissions (file) {
    return new Promise((resolve, reject) => {
      if (!stores.authStore.isUserLoggedIn) {
        return reject(new Error('User must be logged in to upload submissions'))
      }
      let formData = new FormData()
      formData.append('file', file)
      axios.post('/submissions/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${stores.authStore.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }).then((result) => {
        console.log('Got a result, neat')
        return resolve(result)
      }).catch((err) => {
        // TODO: Log this happening (means Arena failed us basically)
        return reject(err)
      })
    })
  }
}
