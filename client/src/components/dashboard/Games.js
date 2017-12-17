import React from 'react'
import GameBadge from '../../components/GameBadge'

export default class Games extends React.Component {
  render () {
    return (
      <div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' >Opponent Name</div>
          <div className='col-lg-6' >Result</div>
          <div className='col-lg-2' >Viz Link</div>
        </div>
        <GameBadge opponentName={'The Voodles'} result={'Win'} description={'Opponent failed to compile'} gameID={'345765356'}/>
        <GameBadge opponentName={'The Doodles'} result={'Lose'} description={'Your AI got wrecked, sorry.'} gameID={'345765356'}/>
        <GameBadge opponentName={'The Noodles'} result={'Lose'} description={' Scofdasfdjsaklf dasjfkdjaslf adfsas fdasjfkdlas f;lads fdslkf dsal;jfkdas; fdslasot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot '} gameID={'345765356'}/>
        <GameBadge opponentName={'The Poodles'} result={'Lose'} description={'Your AI got wrecked, sorry.'} gameID={'345765356'}/>
        <GameBadge opponentName={'The ScDoodles'} result={'Win'} description={'The reason doesn\'t matter, you won!'} gameID={'345765356'}/>
        <GameBadge opponentName={'The McNoodles'} result={'Lose'} description={'Your AI got wrecked, sorry. Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot Scoot'} gameID={'345765356'}/>
        <GameBadge opponentName={'The Scoodles'} result={'Lose'} description={'Your AI got wrecked, sorry.'} gameID={'345765356'}/>
      </div>
    )
  }
}
