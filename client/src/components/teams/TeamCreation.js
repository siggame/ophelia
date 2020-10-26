import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { validateTeamCreation } from '../../modules/teams';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import ShowTeams from './ShowTeams';
import axios from 'axios';
import ReactTable from "react-table";


import 'react-overlay-loader/styles.css';

@inject('authStore')
@inject('teamStore')
@observer
export class UserLists extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mates: '',
            kickSubmitted: '',
            hasErrors: '',
            errorMessage: '',
            userRemoved: ''
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(name) {
        this.props.teamStore.kickUser(name).then(() => {
            this.setState({
                formSubmitted: true,
                hasErrors: false,
                userRemoved: name,
                kickSubmitted: true
            })
        }).catch((err) => {
            this.setState({
                formSubmitted: true,
                formError: err,
                hasErrors: true,
                kickSubmitted: true,
                errorMessage: 'Failed to kick user! Are you a team captain?'
            })
        })
    }

    render() {
        let mates = this.props.mates
        var teamMates = {
            mate: []
        }
        let columns = [{
            Header: 'User Name',
            accessor: 'mates'
        }, {
            Header: 'Manage Members',
            accessor: 'manage',
            Cell: props => <button onClick={() => this.handleClick(props.value)}>Kick</button>
        }
        ]
        mates.map((data) => {
            teamMates.mate.push({
                "mates": data,
                "manage": data
            })
            return teamMates.mate
        })

        let kickError = null;
        if(this.state.kickSubmitted) {
            if(this.state.hasErrors) {
                kickError = (
                    <span style={{ color: 'red', marginLeft: 10 }}>{this.state.errorMessage}</span>
                )
            } else {
                kickError = (
                    <span style={{ color: 'green', marginLeft: 10 }}>User removed successfully! </span>
                )
            }
        }

        return(
            <div>
                {kickError}
                {teamMates.mate ? <ReactTable data={teamMates.mate} columns={columns} defaultPageSize={5} /> : <h3>No teammates found!</h3>}
            </div>
        )
    }
}
@inject('authStore')
@inject('teamStore')
@observer
export default class TeamCreation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formSubmitted: false,
            hasErrors: true,
            loading: false,
            teamname: '',
            errorMessage: '',
            userTeamName: '',
            statratio: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLeaveOwnTeam = this.handleLeaveOwnTeam.bind(this);
    }

    componentDidMount() {
        // Work around because I couldn't call this.props.authStore.user.teamName
        axios.get(`${process.env.REACT_APP_API_URL}/users/${this.props.authStore.userId}`).then((response) => {
            this.setState({
                userTeamName: response.data.user.teamName
            })
        })
        this.props.teamStore.getAllTeamMates()
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    handleLeaveOwnTeam() {
        this.props.teamStore.removeSelfFromTeam()
        this.setState({
            userTeamName: null
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ loading: true });
        validateTeamCreation(this.state.teamname, this.props.authStore.userId).then(() => {
            this.setState({
                formSubmitted: true,
                hasErrors: false
            })
            this.props.authStore.getCurrentUser()
            axios.patch(process.env.REACT_APP_API_URL + "/pay/" + this.props.authStore.getCurrentUser(), {
                cardnumber: this.state.cardnumber,
                carddate: this.state.carddate,
                cardcsv: this.state.cardcsv 
            })
        }).catch((err) => {
            console.log(err)
            this.setState({
                formSubmitted: true,
                formError: err,
                loading: false,
                errorMessage: err.teamname
            })
        })
    }

    render(){
        let formError;
        if(this.state.formSubmitted) {
            if (this.state.hasErrors) {
                formError = (
                    <span style={{ color: 'red', marginLeft: 10 }}>{this.state.errorMessage}</span>
                )
            } else {
                return (
                    <div>
                        <Redirect to={{ pathname: '/' }} />
                    </div>
                )
            }
        }

        return(
            <div>
                {this.state.userTeamName === null ? 
                <div className='col-md-4 col-md-offset-4'>
                    <h3>Create Team</h3>
                    <p><strong>*DO NOT LEAVE YOUR TEAM IF YOU WISH TO NOT REPAY (NOT REFUNDABLE & IF YOU LEAVE YOUR TEAM YOU WILL BE ASKED TO REPAY)*</strong></p>
                    <form>
                        {formError}
                    <div className="form-group">
                        <label htmlFor="teamname">Team Name</label>
                        <input type="text" className="form-control" name="teamname" placeholder="Team Name" value={this.state.teamname} onChange={this.handleChange} />
                        <input type="text" className="form-control" name="cardnumber" placeholder="Card Number" value={this.state.cardnumber} onChange={this.handleChange} />
                        <input type="text" className="form-control" name="carddate" placeholder="Exp. Date (MM/YY)" value={this.state.carddate} onChange={this.handleChange} />
                        <input type="text" className="form-control" name="cardcsv" placeholder="CSV" value={this.state.cardcsv} onChange={this.handleChange} />
                    </div>
                    <button type='submit' onClick={this.handleSubmit} className='btn btn-default btn-block btn-lg' style={{marginTop: 32}}>Create Team</button>
                </form>
                </div>
                :
                    <div className='col-md-4 col-md-offset-4'>
                        <h2 style={{ fontWeight:'bold', textAlign: "center" }}>Team Management for {this.state.userTeamName}</h2>
                        <div className="team-management">
                            <span>Leave Current Team</span>
                            <button onClick={this.handleLeaveOwnTeam}>Leave Team</button>
                            <span>Team Members</span>
                            <UserLists mates={this.props.teamStore.teammates} />
                        </div>
                    </div>
                }
                <LoadingOverlay>
                    <div className="col-md-8 col-md-offset-2"><ShowTeams /></div>
                    <Loader loading={this.props.teamStore.isLoading} />
                </LoadingOverlay>
            </div>
        )
    }
}
