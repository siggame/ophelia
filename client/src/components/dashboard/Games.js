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
  //Need to slice up the array to display certain amount per page
  //I'm not really too sure on the proper way to call and modify parameters inside of a function
  handlePageClick = (games,endingpos,begining, gamesdisplay) => {
    let oldending = endingpos;
    let oldbegin = begining;
    gamesdisplay = games.slice(endingpos, begining+endingpos);
    this.begining = oldending;
    this.endingpos = oldending+oldbegin;
    return gamesdisplay;
  };
  render () {
    let games = [
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Lose', description: 'You stink, I guess', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Opponent Failed to Compile', id: '21839712937'},
      {opponent: 'CompSigh', status: 'Win', description: 'Won via coin flip', id: '21839712937'}

    ]
    //Maximum number of items being displayed each time
    let maxperpage=10;
    //Calculate how many pages are needed
    let numpages = Math.ceil(games.length/maxperpage);
    //Setting the ending point to get ready for array slice
    let endingpos = maxperpage;
    //Setting the beginning of the array slice
    let begining = 0;
    //Not really sure on how to get the function called in order to correctly slice an array
    let gamesdisplay = null;
    //handlePageClick is what is called when the "next" button is clicked not sure what happens on previous (haven't tested)
    gamesdisplay= this.handlePageClick(games, endingpos, begining, gamesdisplay);
    console.log("Games Display: ")
    console.log({gamesdisplay})
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
        <GamesList games={this.gamesdisplay}/>
        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       pageCount={numpages}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick(games, endingpos, begining)}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
      </div>
    )
  }
}
