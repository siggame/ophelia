import axios from 'axios'
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
          <div className='text-center' style={{ paddingTop: '5vh', height: '130px', minWidth: '320px' }} >
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
@inject('authStore')
//Team store is temp
@inject('teamStore')
@inject('submissionStore')
@observer
export default class Games extends React.Component {
  constructor (props) {
    super(props)

    // TODO: Make maxPerPage a prop
    this.state = {
      currentPage: 1,
      users: [],
      opponentFilter: '',
      versionFilter: '',
      statusFilter: ''
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleFilter  = this.handleFilter.bind(this)
  }

  componentWillMount () {
    // Grab a list of all users that aren't this one.
    axios.get(process.env.REACT_APP_API_URL + '/users').then((result) => {
      this.setState({
        users: result.data.users
      })
    }).catch((err) => {
      console.log('Errored while trying to get users - ', err.message)
    })
  }

  handleFilter (type, e) {
    let filterParams = {
      opponent: this.state.opponentFilter,
      result: this.state.statusFilter,
      version: this.state.versionFilter
    }
    if (type === 'opponent') {
      this.setState({
        opponentFilter: e.target.value
      })
      filterParams.opponent = e.target.value
    } else if (type === 'version') {
      this.setState({
        versionFilter: e.target.value
      })
      filterParams.version = e.target.value
    } else {
      this.setState({
        statusFilter: e.target.value
      })
      filterParams.result = e.target.value
    }
    this.props.gameStore.loadGames(this.state.currentPage, filterParams)
    e.preventDefault()
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
    this.props.gameStore.loadGames(1, {
      opponent: this.state.opponentFilter,
      result:this.state.statusFilter,
      version:this.state.versionFilter
    })
  }

  render () {
    // Generate a list of all opponents to filter by
    let opponentOptions = "Not avaiable"
    try { 
      opponentOptions = this.state.users.map((user) => {
        if (user !== this.props.authStore.username) {
          return (
            <option key={user} value={user}>{user}</option>
          )
        }
        else {
          return null;
        }
      })
    } catch(err) {
      console.log("No users to map! And here is your error! ", err)
    }
    let versionOptions = this.props.submissionStore.submissions.map(submission => <option key={submission.version} value={submission.version}>{submission.version}</option>)
    versionOptions.reverse()
    let paginateSection
    if (this.props.gameStore.games.length > 0) {
      paginateSection = (
        <div style={{height: 90}}>
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
          <div className='col-xs-4'><h2 style={{ fontWeight:'bold' }}>Games</h2></div>
          <button buttonOnClick={this.props.teamStore.loadTeam("9")}>Test</button>
          <div className='col-xs-6' />
          <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}><ButtonRefresh buttonOnClick={this.handleRefresh} /></div>
        </div>
        <div className='row' style={{ margin: '0 10px 0 10px', display: 'flex' }} >
          <select className='col-xs-4 form-control' name='opponent' value={this.state.opponentFilter} onChange={this.handleFilter.bind(this, 'opponent')}>
            <option value=''>Opponent Filter</option>
            {opponentOptions}
          </select>
          <select className='col-xs-4 form-control' name='version' value={this.state.versionFilter} onChange={this.handleFilter.bind(this, 'version')}>
            <option value=''>Version Filter</option>
            {versionOptions}
          </select>
          <select className='col-xs-4 form-control' value={this.state.statusFilter} name='status' onChange={this.handleFilter.bind(this, 'status')}>
            <option value=''>Status Filter</option>
            <option value='win'>Win</option>
            <option value='loss'>Loss</option>
          </select>
        </div>
        <GamesList games={this.props.gameStore.games} />
        {paginateSection}
      </div>
    )
  }
}