import React from 'react'
import { Loader } from 'react-overlay-loader'
import { inject} from 'mobx-react'
import { validateInvite } from '../../modules/invites'


import 'react-overlay-loader/styles.css'

@inject('authStore')
@inject('invitesStore')
export default class SendInvite extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            userToInvite: '',
            formErrors: {},
            formSubmitted: false,
            hasErrors: true,
            loading: false,
            errorMessage: ''
        }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const userToInvite = target.name

        this.setState({
            [userToInvite]: value
        })
    }

    handleSubmit(event) {
        this.setState({ loading: true })
        validateInvite(this.props.authStore.user.teamName, this.state.userToInvite).then(() => {
            this.setState({
                formSubmitted: true,
                hasErrors: false,
                inviteSent: this.state.userToInvite,
            })
        }).catch((err) => {
            this.setState({
                formSubmitted: true,
                formErrors: err,
                loading: false,
                errorMessage: err
            })
        })
        event.preventDefault();
    }

    render() {
        let teamError;
        const username = this.state.inviteSent

        if(this.state.formSubmitted) {
            if(this.state.hasErrors) {
                teamError = (
                    <span style={{ color: 'red', marginLeft: 10 }}>{this.state.errorMessage}</span>
                )
            } else {
                return (
                    <div>
                    <h3>Invite User To Your Team</h3>
                    <form>
                        <h4>Invite to {username} sent!</h4>
                        <div className='form-group'>
                            <label htmlFor='username'>User Name</label>
                            <input type='text' className='form-control' name='userToInvite' placeholder='User Name' value={this.state.username} onChange={this.handleChange} />
                        </div>
                        <button type='submit' onClick={this.handleSubmit} className='btn btn-default btn-block btn-lg' style={{marginTop: 32}}>Send</button>
                    </form>
                </div>
                )
            }
        }

        return (
            <div>
                <h3>Invite User To Your Team</h3>
                <form>
                    {teamError}
                    <div className='form-group'>
                        <label htmlFor='username'>User Name</label>
                        <input type='text' className='form-control' name='userToInvite' placeholder='User Name' value={this.state.username} onChange={this.handleChange} />
                    </div>
                    <button type='submit' onClick={this.handleSubmit} className='btn btn-default btn-block btn-lg' style={{marginTop: 32}}>Send</button>
                </form>
                <Loader loading={this.state.loading} fullPage />
            </div>
        )
    }
}