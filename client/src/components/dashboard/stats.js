import React from 'react'
import axios from 'axios'
import { inject, observer } from 'mobx-react'
import ReactTable from "react-table";

export default class Stats extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            previousProp : true
        })
    }

    componentDidUpdate(prevProps) {
        console.log("PREVIOUS PROP" + this.state.previousProp)
        console.log("CURRENT PROP" + this.props.userInfo)
        if(this.props.userInfo !== undefined && this.state.previousProp) {
            console.log("Inside first if")
            if(this.props.userInfo !== null) {
                console.log("Before axios get")
                axios.get(`${process.env.REACT_APP_API_URL}/stats/${this.props.userInfo.teamName}`).then((response) => {
                    if(response.data.stats[0] !== undefined){
                        let stats = response.data.stats[0].stats
                        let numgames = response.data.stats[0].stats.wins + response.data.stats[0].stats.losses
                        stats['percentwins'] = stats.wins/numgames * 100
                        stats['percentlosses'] = stats.losses/numgames * 100
                        this.setState({
                            statratio: stats,
                            teamstats: response.data.stats
                    })
                    }
                })
                console.log("Got in here") 
                this.setState({
                    previousProp: false
                })
            }
        }
    }
    render() {
        let columns = [{
            Header: "Team Name",
            accessor: 'name'
        }, {
            Header: "Wins",
            id: 'winnum',
            accessor: d => d.stats.wins
        }, {
            Header: "Losses",
            id: 'lossnum',
            accessor: d => d.stats.losses
        }]

        console.log(this.props.userInfo !== undefined ? this.props.userInfo.teamName : "Undefined")
        console.log(this.state.statratio)
        return (
            <div>
                <h2 style={{ fontWeight:'bold' }}>Team Stats</h2>
                {this.state.statratio ? 
                <div>
                <div className="team-win-loss">
                <ul>
                    <li><h2>{this.state.statratio.wins}</h2></li>
                    <li><h2>Wins</h2></li>
                </ul>
                <ul>
                    <li><h2>{this.state.statratio.losses}</h2></li>
                    <li><h2>Losses</h2></li>
                </ul>
                </div>
                <ReactTable data={this.state.teamstats} columns={columns} defaultPageSize={10}/>
                </div>
                : <h2>No games found!</h2>}

            </div>
        )
    }
}