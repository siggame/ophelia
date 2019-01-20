import { observable, action, runInAction, reaction } from 'mobx'
import RequestLayer from '../modules/requestLayer'

export class statStore{
  @observable leaderboard = []
  @observable isStale = false

  constructor () {
    this.requestLayer = new RequestLayer()
    this.loadLeaderboard = this.loadLeaderboard.bind(this)
    this.makeDataStale = this.makeDataStale.bind(this)

    reaction(
      () => this.isStale,
      () => {
        if(this.isStale) {
          this.loadLeaderboard()
        }
      }
    )
  }

  @action makeDataStale() {
    this.isStale = true
  }

  @action async loadLeaderboard () {
    try {
      const response = await this.requestLayer.fetchLeaderboard()
      runInAction(() => {
        console.log(response.data.leaderboard)
        this.leaderboard = response.data.leaderboard
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export default new statStore()