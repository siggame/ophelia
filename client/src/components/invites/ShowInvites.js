import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactTable from "react-table";
import axios from 'axios';

@inject('teamStore')
@inject('invitesStore')
export class InvitesList extends React.Component {
    constructor(props) {
        super(props);

        this.handleInviteAction = this.handleInviteAction.bind(this);
    }

    handleInviteAction(id, status) {
        this.props.invitesStore.inviteAction(id, status)
    }

    render() {
        let invites = this.props.invites; 
        var inviteName = {
            invite: []
        }
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

        invites.map((data) => {
            this.props.teamStore.getName(data.team_id).then(response => {

                if(!data.is_completed)
                inviteName.invite.push({
                    "id": data.id,
                    "name": response
                })
                console.log("THIS IS THE RESPONSE: ")
                console.log(response)
                console.log(inviteName.invite)
            })
            console.log("test")
        })
        return (
            <div>
                {inviteName.invite.length > 0 ? <ReactTable data={inviteName.invite} columns={columns} defaultPageSize={3}/> : <h3>No Pending Invites!</h3>}
            </div>
        )
    }
}

@inject('invitesStore')
@inject('teamStore')
@observer
export default class Invites extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            invites: []
        }
        // this.handleInviteAccept.bind(this);
    }

    componentDidMount() {
        this.props.invitesStore.loadInvites();
        console.log(this.props.invitesStore.data)
    }

    // handleInviteAccept(id) {
    //     this.props.invitesStore.
    // }

    render() {
        return(
                <div className='row'>
                    <h2 style={{ fontWeight:'bold' }}>Invites</h2>
                    <InvitesList invites={this.props.invitesStore.invites} teams={this.props.teamStore.teamSortId}/>
                </div>
        )
    }
}