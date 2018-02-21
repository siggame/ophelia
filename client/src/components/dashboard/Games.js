import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactPaginate from 'react-paginate';
import GameBadge from '../../components/GameBadge'
import ButtonRefresh from '../ButtonRefresh'

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
  //Need to slice up the array to display certain amount per page
  //I'm not really too sure on the proper way to call and modify parameters inside of a function
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
    return (
      <div>
        <div className='row' style={{ marginLeft: 10, display: 'flex' }} >
          <div className='col-lg-4'><h2>Games</h2></div>
          <div className='col-lg-6' />
          <div className='col-lg-2' style={{ marginTop: '5vh'}}><ButtonRefresh buttonOnClick={this.handleRefresh} /></div>
        </div>
        <div className='row' style={{ marginLeft: 10 }} >
          <div className='col-lg-4' >Opponent Name</div>
          <div className='col-lg-6' >Result</div>
          <div className='col-lg-2' >Viz Link</div>
        </div>
        <GamesList games={this.props.gameStore.games}/>
        <div className='col-md-2' />
        <div className='games-paginate text-center col-md-8'>
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
            forcePage={this.state.currentPage-1}
            onPageChange={this.handlePageClick}
          />
        </div>
        <div className='col-md-2' />
      </div>
    )
  }
}
