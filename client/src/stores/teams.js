import { observable, action, runInAction, reaction } from 'mobx'
import RequestLayer from '../modules/requestLayer'

// TODO: Create cache of teams
export class TeamStore {
  @observable team = undefined
  @observable teams = []
  @observable numPages = 5
  @observable pageSize = 3
  @observable isLoading = false
  @observable isStale = false
  @observable lastUpdated = null
  @observable teamSortId = []

  constructor () {
    this.requestLayer = new RequestLayer()
    this.loadAllTeams = this.loadAllTeams.bind(this)
    this.makeDataStale = this.makeDataStale.bind(this)

    reaction(
      () => this.isStale,
      () => {
        if(this.isStale) {
          this.loadAllTeams()
        }
      }
    )
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

  @action makeDataStale() {
    this.isStale = true
  }

  @action async getName(teamId) {
    try {
      const response = await this.requestLayer.getTeamName(teamId);
      runInAction(() => {
        var item = response.data.team.name
        console.log(item)
        return response.data.team;
      })
    } catch(err) {
      console.log(err)
    }
  }

  @action async getAllTeams() {
    try {
      const response = await this.requestLayer.getAllTeams();
      runInAction(() => {
        this.teams = response.data.names
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

  @action loadAllTeams(pageNum = 1, filter = {}){
    this.isLoading = true
    this.requestLayer.fetchTeams(pageNum, this.pageSize, filter).then(action('loadTeams-callback', (data) => {
      this.teams = []
      this.numPages = data.numPages
      data.teams.forEach((json) => { 
        this.teams.push(json)
      })
      this.isLoading = false
      this.isStale = false
      this.lastUpdated = new Date()
    })).catch((err) => {
      console.log("Error Loading Teams", err.message)
    })
  }

}
export default new TeamStore()
