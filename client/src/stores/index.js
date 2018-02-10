import { autorun } from 'mobx'

import AuthStore from './auth'
import { GameStore } from './games'

let gameStore = new GameStore()
let authStore = new AuthStore()

// Refresh gamaes when stales
autorun(() => {
  if (gameStore.isStale) {
    console.log('Refreshing games...')
    gameStore.loadGames()
  }
})

export default {
  authStore,
  gameStore
}
