import React from 'react'
import { Loader } from 'react-overlay-loader'
import _ from 'lodash'


import 'react-overlay-loader/styles.css'

export default class SendInvite extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            formErrors: {},
            formSubmitted: false,
            hasErrors: true,
            loading: false
        }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        this.setState({ loading: true })
        // TODO: Create username validation and then send the request  
        console.log(this.state.username)
        event.preventDefault();
    }

    render() {
        let userError;
        let teamError;

        if(this.state.formSubmitted) {
            if(this.state.hasErrors) {
                _.each(this.state.formErrors, (value, key) => {
                    switch(key) {
                        case 'user':
                            userError = (
                                <span style={{ color: 'red', marginLeft: 10 }}>{value[0]}</span>
                            )
                            break;
                        case 'team': 
                                teamError = (
                                    <span style={{ color: 'red', marginLeft: 10 }}>{value[0]}</span>
                                )
                            break;
                        default: 
                            break;
                    }
                })
            } else {
                return (
                    <div>
                        {/* TODO: Have a message saying invite sent */}
                    </div>
                )
            }
        }

        return (
            <div className='col-md-6'>
                <h3>Invite User To Your Team</h3>
                <form>
                    {userError}
                    {teamError}
                    <div className='form-group'>
                        <label htmlFor='username'>User Name</label>
                        <input type='text' className='form-control' name='username' placeholder='User Name' value={this.state.username} onChange={this.handleChange} />
                    </div>
                    <button type='submit' onClick={this.handleSubmit} className='btn btn-default btn-block btn-lg' style={{marginTop: 32}}>Send</button>
                </form>
                <Loader loading={this.state.loading} fullPage />
            </div>
        )
    }
}