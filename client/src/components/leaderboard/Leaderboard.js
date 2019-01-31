import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactTable from 'react-table'

export class LeaderboardList extends React.Component {
  render () {
    let leaderboard = this.props.leaderboard;

    let columns = [
        { Header: 'Team Name', accessor: 'teamName' },
        { Header: 'Wins', accessor: 'wins' },
        { Header: 'Losses', accessor: 'losses' },
        { Header: 'Win/Loss Ratio', accessor: 'ratio' },
      ]

    return (
      <ReactTable data={leaderboard} columns={columns} defaultPageSize={10} />
    )
  }
}

@inject('statStore')
@observer
export default class Leaderboard extends React.Component {

  componentDidMount() {
    this.props.statStore.loadLeaderboard()
  }

  render () {
    return (
      <div className='row'>
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Leaderboard</h2>
        <LeaderboardList leaderboard={this.props.statStore.leaderboard} />
      </div>
    )
  }
}