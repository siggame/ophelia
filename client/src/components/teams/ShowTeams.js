import { inject } from 'mobx-react'
import React from 'react'
import TeamBadge from './TeamBadge'
import axios from 'axios'
import ButtonRefresh from '../ButtonRefresh'
import ReactPaginate from 'react-paginate'

export class TeamsList extends React.Component {
    
    render(){
        let teams = this.props.teams;
        console.log(teams)
        let teamsList;
        if(teams) {
            if(teams.length === 0) {
                teamsList = (
                    <div className='text-center' style={{ paddingTop: '5vh', height: '130px', minWidth: '320px' }} >
                        No teams have been created yet. Feel free to go ahead and create one!
                    </div>
                )
            } else {
                teamsList = teams.map((data) => {
                    let testdata = JSON.stringify(data)
                    console.log(testdata)
                    return <TeamBadge name={data} key={data} />
                })
            }
        }
        return (
            <div>
                {teamsList}
            </div>
        )
    }
}

@inject('teamStore')
export default class Teams extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            currentPage: 1,
            teams: [],
            nameFilter: ''
          }
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentWillMount() {
        axios.get(process.env.REACT_APP_API_URL + '/teams').then((result) => {
            this.setState({
              teams: result.data.names
            })
          }).catch((err) => {
            console.log('Errored while trying to get users - ', err.message)
          })
        }

    handleFilter(type, e) {
        let filterParams = {
            names: this.state.nameFilter
        }
        if(type === 'names') {
            this.setState({
                nameFilter: e.target.value
            })
            filterParams.names = e.target.value
        }
        this.props.teamStore.loadAllTeams(this.state.currentPage, filterParams)
    }

    handlePageClick(data) {
        let newPage = data.selected + 1
        this.setState({
            currentPage: newPage
        })
        this.props.teamStore.loadAllTeams(newPage)
    }

    handleRefresh() {
        this.setState({
            currentPage: 1
        })
        this.props.teamStore.loadAllTeams(1, {
            names: this.state.nameFilter
        })
    }

    render() {
        let teamOptions = "Not avaiable"
        try {
            teamOptions = this.state.teams.map((team) => {
                return (
                    <option key={team} value={team}>{team}</option>
                )
            })
        } catch(err) {
            console.log("No teams to map! Here is your error: ", err)
        }

        let paginateSection
        if (this.props.teamStore.teams.length > 0) {
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
      return(
        <div>
        <div className='row' >
          <div className='col-xs-4'><h2 style={{ fontWeight:'bold' }}>Teams</h2></div>
          <div className='col-xs-6' />
          <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}><ButtonRefresh buttonOnClick={this.handleRefresh} /></div>
        </div>
        <div className='row' style={{ margin: '0 0', display: 'flex' }} >
          <select className='col-xs-4 form-control' name='opponent' value={this.state.opponentFilter} onChange={this.handleFilter.bind(this, 'opponent')}>
            <option value=''>Team Name Filter</option>
            {teamOptions}
          </select>
        </div>
        <TeamsList teams={this.state.teams} />
        {paginateSection}
      </div>
      )
    }
    
}
