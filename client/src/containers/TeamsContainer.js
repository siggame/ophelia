import React from 'react'
import ShowTeams from '../components/teams/ShowTeams';

export default class TeamsContainer extends React.Component {
    constructor (props) {
        super(props)
    }

    render() {
        return(
            <div className="col-md-6"><ShowTeams /></div>
        )
    }
}