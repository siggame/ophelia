import React from 'react'
import GameBadge from '../../components/GameBadge'
import ButtonRefresh from '../ButtonRefresh'

export default class Games extends React.Component {
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
    let debugGamesList = debugData.map((data, index) => {
      return <GameBadge opponentName={data.name} result={data.result} description={data.desc} gameId={data.gameId} key={index} />
    })

    return (
      <div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' />
          <div className='col-lg-6' />
          <div className='col-lg-2' ><ButtonRefresh /></div>
        </div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' >Opponent Name</div>
          <div className='col-lg-6' >Result</div>
          <div className='col-lg-2' >Viz Link</div>
        </div>
        {debugGamesList}
      </div>
    )
  }
}
