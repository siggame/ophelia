import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { validateTeamCreation, checkValidTeamCreation } from '../../modules/teams';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import ShowTeams from './ShowTeams';
import axios from 'axios';
import ReactTable from "react-table";
import { loadStripe } from '@stripe/stripe-js';

import 'react-overlay-loader/styles.css';

const stripePromise = loadStripe('pk_live_rXRE81suFTuEjgWFo76GVW0p')

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
            statratio: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLeaveOwnTeam = this.handleLeaveOwnTeam.bind(this);

        if (this.props.location.search && this.props.location.search.indexOf("?name=") > -1) {
            let teamName = this.props.location.search.slice(6);
            validateTeamCreation(teamName, this.props.authStore.userId).then(async () => {
                this.setState({
                    formSubmitted: true,
                    hasErrors: false
                })
                this.props.authStore.getCurrentUser()
            })
        }
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
        checkValidTeamCreation(this.state.teamname, this.props.authStore.userId).then(async () => {
            const stripe = await stripePromise;
            const {error} = await stripe.redirectToCheckout({
                lineItems: [{
                    price: 'price_1HjH6bKBeZfFFL05s7C6I4x7',
                    quantity: 1,
                }],
                mode: 'payment',
                successUrl: `https://mmai.siggame.io/create-team/?name=${this.state.teamname}`,
                cancelUrl: 'https://mmai.siggame.io/create-team',
            }).then ((result) => {
                console.log(result);
                if (result.error) {
                    console.log(result.error);
                    console.log(result.error.message);
                    this.setState({
                        formSubmitted: true,
                        hasErrors: true,
                        loading: false,
                        errorMessage: result.error.message
                    });
                }
            });
            this.setState({
                formSubmitted: true,
                hasErrors: false
            })
            this.props.authStore.getCurrentUser()
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
                    <p>Team creation is currently under maintenance. We will let you know when you may make your teams.</p>
                    <p>Creating a team will register your team for the tournament, and redirect you to payment.</p>
                    <p><strong>*DO NOT LEAVE YOUR TEAM IF YOU DO NOT WISH TO REPAY (NON-REFUNDABLE & IF YOU LEAVE YOUR TEAM YOU WILL BE ASKED TO REPAY)*</strong></p>
                    <form>
                        {formError}
                    <div className="form-group">
                        <label htmlFor="teamname">Team Name</label>
                        <input type="text" className="form-control" name="teamname" placeholder="Team Name" value={this.state.teamname} onChange={this.handleChange} />
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
