import { observable, action, reaction } from 'mobx'
import RequestLayer from '../modules/requestLayer'

class UserStore {
  @observable users = []
  @observable isLoading = false
  @observable isStale = false
  @observable lastUpdated = null

  constructor () {
    this.requestLayer = new RequestLayer()


    // This will get called whenever the data is set as staled, and refresh the data.
    reaction(
      () => this.isStale,
      () => {
        if (this.isStale) {
          this.loadUsers()
        }
      })
  }

  @action loadUsers () {
    this.isLoading = true
    // Use requestLayer object to handle actual HTTP call
    this.requestLayer.fetchUsers().then(action('loadUsers-callback', (data) => {
      this.users = data
      this.isLoading = false
      this.isStale = false
      this.lastUpdate = new Date()
    })).catch((error) => {
      console.log('Error loading users', error.message)
      this.isLoading = false
      this.isStale = false
      this.lastUpdated = new Date()
    })
  }

  @action makeDataStale () {
    this.isStale = true
  }
}

export default new UserStore()