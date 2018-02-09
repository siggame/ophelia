import { extendObservable, runInAction } from 'mobx'

import requestLayer from '../modules/requestLayer'

export class GameStore {
  constructor () {
    extendObservable(this, {
      games: [],
      isLoading: true,
      isStale: false,
      lastUpdated: null
    })
    this.loadGames()
  }

  loadGames () {
    runInAction(() => {
      this.isLoading = true
      requestLayer.fetchGames().then((data) => {
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
    })
  }

  makeDataStale () {
    runInAction(() => {
      this.isStale = true
    })
  }

  updateGameFromServer (json) {
    let game = this.games.find(game => game.id === json.id)
    if (!game) {
      // If this is a new game from the server
      game = new Game(json.id, json.opponent, json.status, json.description)
      this.games.push(game)
    } else {
      // Game already exists on the client, update it.
      game.updateFromJson(json)
    }
    // TODO: Handle deleted games (if needed)
  }
}

export class Game {
  constructor (id, opponent, status, description) {
    this.id = id
    this.opponent = opponent

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
