import { observable, action, runInAction } from 'mobx'
import RequestLayer from '../modules/requestLayer'

// TODO: Create cache of teams
class TeamStore {
  @observable team = undefined

  constructor () {
    this.requestLayer = new RequestLayer()
  }

  @action async loadTeam (teamID) {
    try {
      const response = await this.requestLayer.getTeamByName(teamID)
      runInAction(() => {
        this.team = response.data.team
      })
    } catch (err) {
      console.log(err)
    }
  }

  @action async getAllTeams() {
    try {
      const response = await this.requestLayer.getAllTeams();
      runInAction(() => {
        this.team = response.data.names
      })
    } catch (err) {
      console.log(err)
    }
  }

  @action async getCurrentTeam() {
    try {
      const response = await this.requestLayer.getCurrentTeam();
      runInAction(() => {
        this.team = response.data.onTeam;
      })
    } catch (err) {
      throw err;
    }
  }

}
export default new TeamStore()
