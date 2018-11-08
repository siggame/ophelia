import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { validateTeamCreation } from '../../modules/teams';
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import ShowTeams from './ShowTeams';
import axios from 'axios';

import 'react-overlay-loader/styles.css';

@inject('authStore')
@inject('teamStore')
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
                        <h2 style={{ fontWeight:'bold', textAlign: "center" }}>Team Management</h2>
                        <div className="team-management">
                            <span>Leave Current Team</span>
                            <button onClick={this.handleLeaveOwnTeam}>Leave Team</button>
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