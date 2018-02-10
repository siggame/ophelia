import { extendObservable, observable } from 'mobx'

import RequestLayer from '../modules/requestLayer'

export class GameStore {
  constructor () {
    this.requestLayer = new RequestLayer()

    this.games = observable([])
    extendObservable(this, {
      isLoading: true,
      isStale: false,
      lastUpdated: null
    })

    this.loadGames = this.loadGames.bind(this)
    this.makeDataStale = this.makeDataStale.bind(this)

    this.loadGames()
  }

  loadGames () {
    // runInAction(() => {
    console.log('Loading games, func')
    this.isLoading = true
    this.requestLayer.fetchGames().then((data) => {
      data.forEach((json) => {
        this.updateGameFromServer(json)
      })
      this.isLoading = false
      this.isStale = false
      this.lastUpdated = new Date()
    }).catch((err) => {
      // TODO: Actual logging
      console.log('Error loading games', err.message)
    })
    // })
  }

  makeDataStale () {
    // runInAction(() => {
    this.isStale = true
    console.log('Data Store', this.games)
    // })
  }

  updateGameFromServer (json) {
    console.log('update this games', this.games)
    let game = this.games.find(game => game.id === json.id)
    console.log('game find results', game)
    if (!game) {
      // If this is a new game from the server
      let description
      let status = json.status
      if (status === 'finished') {
        if (json.opponent === json.winner) {
          // This means you lost
          status = 'Lost'
          description = json.lose_reason
        } else {
          status = 'Win'
          description = json.win_reason
        }
      } else if (status === 'failed') {
        // TODO: Handle failed building
      }
      game = new Game(json.id, json.opponent, status, description, json.log_url)
      this.games.push(game)
    } else {
      // Game already exists on the client, update it.
      game.updateFromJson(json)
    }
    // TODO: Handle deleted games (if needed)
  }
}

export class Game {
  constructor (id, opponent, status, description, logUrl) {
    this.id = id
    this.opponent = opponent
    this.logUrl = logUrl

    extendObservable(this, {
      status: status,
      description: description
    })
  }

  updateFromJson (json) {
    this.status = json.status
    this.description = json.description
  }
}
