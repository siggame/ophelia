import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactPaginate from 'react-paginate';
import GameBadge from '../../components/GameBadge'
import ButtonRefresh from '../ButtonRefresh'

@inject('gameStore')
@observer
export class GamesList extends React.Component {
  render() {
    let games = this.props.games
    let gamesList = games.map((data) => {
      return <GameBadge opponent={data.opponent} status={data.status} description={data.description}
                        logUrl={data.logUrl} key={data.id}/>
    })

    return (
      <div>
      {gamesList}
      </div>
    );
  }
}

export default class Games extends React.Component {
  constructor (props) {
    super(props)

    // TODO: Make maxPerPage a prop
    this.state = {
      beginning: 0,
      endingPosition: 10
    }
  }
  //Need to slice up the array to display certain amount per page
  //I'm not really too sure on the proper way to call and modify parameters inside of a function
  handlePageClick (games) {
    let oldEnding = this.state.endingPosition
    let oldBeginning = this.state.beginning
    let gamesDisplay = games.slice(this.state.endingPosition, this.state.beginning+this.state.endingPosition);
    this.setState({
      beginning: oldEnding,
      endingPosition: oldEnding+oldBeginning
    })
    return gamesDisplay
  }

  render () {
    let games = [
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712930'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712931'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712932'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712933'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712934'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712935'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712936'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712938'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712939'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712940'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712941'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712942'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712943'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712944'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712945'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712946'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712947'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712948'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712949'}
    ]
    //Maximum number of items being displayed each time
    let maxperpage=10;
    //Calculate how many pages are needed
    let numPages = Math.ceil(games.length/maxperpage);
    //Setting the ending point to get ready for array slice
    let endingpos = maxperpage;
    //Setting the beginning of the array slice
    let begining = 0;
    //Not really sure on how to get the function called in order to correctly slice an array
    let gamesDisplay = null;
    //handlePageClick is what is called when the "next" button is clicked not sure what happens on previous (haven't tested)
    gamesDisplay = this.handlePageClick(games)
    console.log("Games Display: ", gamesDisplay)
    // Remove this once we have actual data coming in.
  //  let games = this.props.gameStore.games
    return (
      <div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' />
          <div className='col-lg-6' />
        </div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' >Opponent Name</div>
          <div className='col-lg-6' >Result</div>
          <div className='col-lg-2' >Viz Link</div>
        </div>
        <GamesList games={games}/>
        <ReactPaginate
          pageCount={numPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={5}
        />
      </div>
    )
  }
}
