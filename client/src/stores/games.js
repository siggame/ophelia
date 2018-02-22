import { action, observable, reaction } from 'mobx'

import RequestLayer from '../modules/requestLayer'

/**
 * MobX store for games played in the arena.
 * 
 * @export
 * @class GameStore
 */
export class GameStore {
  @observable games = []
  @observable numPages = 5
  @observable pageSize = 10
  @observable isLoading = false
  @observable isStale = false
  @observable lastUpdated = null

  /**
   * Creates an instance of GameStore.
   * @memberof GameStore
   */
  constructor () {
    this.requestLayer = new RequestLayer()
    this.loadGames = this.loadGames.bind(this)
    this.makeDataStale = this.makeDataStale.bind(this)

    // This function is a MobX fellow that watches for whenever the 'isStale' variable changes.
    // Whenever it does, it goes ahead and sees if the data needs to be updated.
    reaction(
      () => this.isStale,
      () => {
      if (this.isStale) {
        this.loadGames()
      }
    })
  }

  /**
   * Grabs games from the server and throws them in the store
   * 
   * @memberof GameStore
   */
  @action loadGames (pageNum=1) {
    this.isLoading = true
    // Actual HTTP request is abstracted to requestLayer object
    this.requestLayer.fetchGames(pageNum, this.pageSize).then(action("loadGames-callback", (data) => {
      this.games = []
      this.numPages = data.numPages
      data.games.forEach((json) => {
        this.createGameFromServer(json)
      })
      this.isLoading = false
      this.isStale = false
      this.lastUpdated = new Date()
    })).catch((err) => {
      // TODO: Actual logging
      console.log('Error loading games', err.message)
    })
  }

  /**
   * Used to initiate a games load, via an autorun in stores/index.js
   * 
   * @memberof GameStore
   */
  @action makeDataStale () {
    this.isStale = true
  }

  /**
   * Used to remove all games from the store. Mainly useful when a user logs out.
   * 
   * @memberof GameStore
   */
  @action resetGameData () {
    this.games = []
    this.lastUpdated = null
  }

  /**
   * Updates or creates a new game based on JSON data from the server
   * 
   * @param {Object} json object containing the game information 
   * @memberof GameStore
   */
  @action createGameFromServer (json) {
    let description
    let status = json.status
    if (status === 'finished') {
      if (json.opponent === json.winner) {
        // This means you lost
        status = 'Lost'
        description = json.lose_reason
      } else {
        status = 'Won'
        description = json.win_reason
      }
    } else if (status === 'failed') {
      // TODO: Handle failed building
    }
    let game = new Game(json.id, json.opponent, status, description, json.log_url, json.version, json.created_at, json.updated_at)
    this.games.push(game)
  }
}

/**
 * Class for storing individual game objects
 * 
 * @export
 * @class Game
 */
export class Game {
  @observable status
  @observable description
  @observable updatedAt

  /**
   * Creates an instance of Game.
   * @param {Number} id ID, unique from the database
   * @param {string} opponent Team name of opponent faced
   * @param {string} status Either 'Won' or 'Lost' if game is finished, or 'Queued'/'Failed'
   * @param {string} description Reason for winning/losing, or why it failed
   * @param {string} logUrl URL to visualizer instance displaying log
   * @param {Number} version The submission ID that the game was played with
   * @param {Date} createdAt Date when the game was created in the DB
   * @param {Date} updatedAt When the game was updated in the DB
   * @memberof Game
   */
  constructor (id, opponent, status, description, logUrl, version, createdAt, updatedAt) {
    this.id = id
    this.opponent = opponent
    this.logUrl = logUrl
    this.description = description
    this.status = status
    this.version = version
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  /**
   * Updates game object based on new JSON data being passed to it.
   * 
   * @param {any} json JSON from the server containing new data
   * @memberof Game
   */
  @action updateFromJson (json) {
    let description
    let status = json.status
    if (status === 'finished') {
      if (json.opponent === json.winner) {
        // This means you lost
        status = 'Lost'
        description = json.lose_reason
      } else {
        status = 'Won'
        description = json.win_reason
      }
    } else if (status === 'failed') {
      // TODO: Handle failed building
    }
    this.status = status
    this.description = description
  }
}

export default new GameStore()