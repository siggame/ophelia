import { autorun } from 'mobx'

import AuthStore from './auth'
import { GameStore } from './games'

let gameStore = new GameStore()
let authStore = new AuthStore()

// This function is a MobX fellow that watches for whenever the 'isStale' variable changes.
// Whenever it does, it goes ahead and sees if the data needs to be updated.
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
