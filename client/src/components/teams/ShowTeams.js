import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactTable from "react-table";

export class TeamsList extends React.Component {
    
    render(){
        let teams = this.props.teams;
        var teamName = {
            team: []
        }
        let columns =  [{
            Header: "Team Names",
            accessor: 'name',
          }]

        teams.map((data) => {
            teamName.team.push({
                "name" : data
            })
        })
        return (
            <ReactTable data={teamName.team} columns={columns} defaultPageSize={10} />
        )
    }
}

@inject('teamStore')
@observer
export default class Teams extends React.Component {

    componentDidMount() {
        // Temp workaround until teams load on page load
        this.props.teamStore.loadAllTeams()
        }

    render() {
      return(
        <div className='row'>
            <h2 style={{ fontWeight:'bold' }}>Teams</h2>
            <TeamsList teams={this.props.teamStore.teams} />
        </div>
      )
    }
    
}
