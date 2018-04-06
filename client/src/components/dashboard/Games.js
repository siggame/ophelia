import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactPaginate from 'react-paginate'
import GameBadge from '../../components/GameBadge'
import ButtonRefresh from '../ButtonRefresh'

export class GamesList extends React.Component {
  render () {
    let games = this.props.games
    let gamesList
    if (games) {
      if (games.length === 0) {
        gamesList = (
          <div className='text-center' style={{ paddingTop: '5vh' }} >
            No games have been played yet. Upload some code for games to run!
          </div>
        )
      } else {
        gamesList = games.map((data) => {
          return <GameBadge {...data} key={data.id} />
        })
      }
    }

    return (
      <div>
        {gamesList}
      </div>
    )
  }
}

@inject('gameStore')
@observer
export default class Games extends React.Component {
  constructor (props) {
    super(props)

    // TODO: Make maxPerPage a prop
    this.state = {
      currentPage: 1
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }
  // I'm not really too sure on the proper way to call and modify parameters inside of a function
  handlePageClick (data) {
    // So this library we're using (React Paginate) thinks an awesome idea to 0-index page numbers.
    // In order to combat that, we have to add one, and type out this comment so someone doesn't get confused.
    let newPage = data.selected + 1
    // Grab our games for the next page
    this.setState({
      currentPage: newPage
    })
    this.props.gameStore.loadGames(newPage)
  }

  handleRefresh () {
    // Since refreshing always sends the page back to 1, need to handle that here.
    this.setState({
      currentPage: 1
    })
    this.props.gameStore.makeDataStale()
  }

  render () {
    let paginateSection
    if (this.props.gameStore.games.length > 0) {
      paginateSection = (
        <div style={{height:90}}>
          <div className='col-xs-2' />
          <div className='games-paginate text-center col-xs-8'>
            <ReactPaginate
              containerClassName='pagination text-center'
              subContainerClassName='pagination pages'
              activeClassName='active'
              breakClassName='break'
              breakLabel={<a>...</a>}
              previousLabel='<<'
              nextLabel='>>'
              pageCount={this.props.gameStore.numPages}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              forcePage={this.state.currentPage - 1}
              onPageChange={this.handlePageClick}
            />
          </div>
          <div className='col-xs-2' />
        </div>
      )
    }
    return (
      <div>
        <div className='row' style={{ margin: '0 10px 0 10px', display: 'flex' }} >
          <div className='col-xs-4'><h2>Games</h2></div>
          <div className='col-xs-6' />
          <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}><ButtonRefresh buttonOnClick={this.handleRefresh} /></div>
        </div>
        <div className='row' style={{ margin: '0 10px 0 10px' }}>
          <div className='col-xs-3 text-center' >Opponent Name</div>
          <div className='col-xs-5 text-center' >Result</div>
          <div className='col-xs-1 text-center' >Version</div>
          <div className='col-xs-1 text-center' >Log</div>
          <div className='col-xs-2 text-center' >Viz Link</div>
        </div>
        <GamesList games={this.props.gameStore.games} />
        {paginateSection}
      </div>
    )
  }
}
