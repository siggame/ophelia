import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { validateTeamCreation } from '../../modules/teams';
import { LoadingOverlay, Loader } from 'react-overlay-loader'
import ShowTeams from './ShowTeams';

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
            errorMessage: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
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
                <LoadingOverlay>
                    <div className="col-md-6"><ShowTeams /></div>
                    <Loader loading={this.props.teamStore.isLoading} />
                </LoadingOverlay>
            </div>
        )
    }
}