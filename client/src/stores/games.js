import { action, observable } from 'mobx'

import RequestLayer from '../modules/requestLayer'

/**
 * MobX store for games played in the arena.
 * 
 * @export
 * @class GameStore
 */
export class GameStore {
  @observable games = []
  @observable isLoading = true
  @observable isStale = true
  @observable lastUpdated = null

  /**
   * Creates an instance of GameStore.
   * @memberof GameStore
   */
  constructor () {
    this.requestLayer = new RequestLayer()
    this.loadGames = this.loadGames.bind(this)
    this.makeDataStale = this.makeDataStale.bind(this)
    // Load game data initially
    this.loadGames()
  }

  /**
   * Grabs games from the server and throws them in the store
   * 
   * @memberof GameStore
   */
  @action loadGames () {
    this.isLoading = true
    // Actual HTTP request is abstracted to requestLayer object
    this.requestLayer.fetchGames().then(action("loadGames-callback", (data) => {
      this.games = []
      data.forEach((json) => {
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
    let game = new Game(json.id, json.opponent, status, description, json.log_url)
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

  /**
   * Creates an instance of Game.
   * @param {any} id ID, unique from the database
   * @param {any} opponent Team name of opponent faced
   * @param {any} status Either 'Won' or 'Lost' if game is finished, or 'Queued'/'Failed'
   * @param {any} description Reason for winning/losing, or why it failed
   * @param {any} logUrl URL to visualizer instance displaying log
   * @memberof Game
   */
  constructor (id, opponent, status, description, logUrl) {
    this.id = id
    this.opponent = opponent
    this.logUrl = logUrl
    this.description = description
    this.status = status
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
