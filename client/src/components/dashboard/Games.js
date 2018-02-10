import { inject } from 'mobx-react'
import React from 'react'

import GameBadge from '../../components/GameBadge'

export default inject('gameStore')(class Games extends React.Component {
  render () {
    // Remove this once we have actual data coming in.
    let debugData = [
      { name: 'CompSigh', result: 'Win', desc: 'Opponent Failed to Compile', gameId: '21839712937' },
      { name: 'CompSigh', result: 'Lose', desc: 'You stink, I guess', gameId: '21839712937' },
      { name: 'CompSigh', result: 'Win', desc: 'Opponent Failed to Compile', gameId: '21839712937' },
      { name: 'CompSigh', result: 'Win', desc: 'Won via coin flip', gameId: '21839712937' },
      { name: 'CompSigh', result: 'Win', desc: 'Opponent Failed to Compile', gameId: '21839712937' },
      { name: 'CompSigh', result: 'Lose', desc: 'All soliders defeated', gameId: '21839712937' },
      { name: 'CompSigh', result: 'Win', desc: 'Opponent Failed to Compile', gameId: '21839712937' }
    ]
    console.log('Game Store Games', this.props.gameStore.games)
    let games = this.props.gameStore.games
    let gamesList = games.map((data) => {
      console.log('Game data', data)
      return <GameBadge opponent={data.opponent} status={data.status} description={data.description} logUrl={data.logUrl} key={data.id} />
    })

    return (
      <div>
        <div className='btn btn-default' onClick={this.props.gameStore.makeDataStale}>Refresh</div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' >Opponent Name</div>
          <div className='col-lg-6' >Result</div>
          <div className='col-lg-2' >Viz Link</div>
        </div>
        {gamesList}
      </div>
    )
  }
})
