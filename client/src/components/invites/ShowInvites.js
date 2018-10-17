import { inject, observer } from 'mobx-react'
import React from 'react'
import ReactTable from "react-table";

@inject('teamStore')
export class InvitesList extends React.Component {
    constructor(props) {
        super(props);

        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
    }

    handleAccept(id) {
        console.log("ACCEPTED")
    }

    handleDecline(id) {
        console.log("Declined!")
    }

    render() {
        let invites = this.props.invites;  
        console.log(invites)
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
                <button className="accept" onClick={() => this.handleAccept(props.id)}>Accept</button>
                <button className="decline">Decline</button>
            </div>
        }]

        invites.map((data) => {
            var delayInMilliseconds = 1000;
            var teamName = this.props.teamStore.getName(data.team_id)
                inviteName.invite.push({
                    "id": data.id,
                    "name": 'test'
                })
        })
        return (
            <div>
                <ReactTable data={inviteName.invite} columns={columns} defaultPageSize={3}/>
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