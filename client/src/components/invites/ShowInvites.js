import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactTable from "react-table";
import axios from 'axios';

@inject('invitesStore')
@inject('teamStore')
@inject('authStore')
@observer
export default class Invites extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            invites: ''
        }
        this.handleInviteAction = this.handleInviteAction.bind(this);
    }

    handleInviteAction(id, status) {
        let array = [...this.state.invites];
        let index;
        this.props.invitesStore.inviteAction(id, status)
        console.log(this.state.invites)
        index = this.state.invites.findIndex(x => x.id == id)
        console.log(index);
        array.splice(index, 1);
        this.setState({
            invites: array
        })

    }

    componentDidMount() {
        var inviteName = {
            invite: []
        }
        axios.get(`${process.env.REACT_APP_API_URL}/invites/users/${this.props.authStore.userId}`).then((response) => {
            response.data.invites.map((data) => {
                this.props.teamStore.getName(data.team_id).then(response => {
                    if(!data.is_completed)
                    inviteName.invite.push({
                        "id": data.id,
                        "name": response
                    })
                    this.setState({
                        invites: inviteName.invite
                    })
                })
            })
        })
    }

    render() {
        let columns = [{
            Header: "Team Name",
            accessor: 'name'
        }, {
            Header: "Action",
            accessor: 'id',
            Cell: props => <div>
                <button className="accept" onClick={() => this.handleInviteAction(props.value, true)}>Accept</button>
                <button className="decline" onClick={() => this.handleInviteAction(props.value, false)}>Decline</button>
            </div>
        }]
        return(
                <div className='row'>
                    <h2 style={{ fontWeight:'bold' }}>Invites</h2>
                    {this.state.invites.length ? <ReactTable data={this.state.invites} columns={columns} defaultPageSize={3}/> : <h3>No invites found!</h3> }
                </div>
        )
    }
}