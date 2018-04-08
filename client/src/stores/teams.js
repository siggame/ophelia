import { observable, action, runInAction } from 'mobx'
import RequestLayer from '../modules/requestLayer'

// TODO: Create cache of teams
class TeamStore {
  @observable team = undefined

  constructor () {
    this.requestLayer = new RequestLayer()
  }

  @action async loadTeam (teamId) {
    try {
      const response = await this.requestLayer.getTeamById(teamId)
      runInAction(() => {
        this.team = response.data.user
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export default new TeamStore()
