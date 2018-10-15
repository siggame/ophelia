import { inject, observer } from 'mobx-react'
import React from 'react'
import axios from 'axios'
import ButtonRefresh from '../ButtonRefresh'
import ReactPaginate from 'react-paginate'
export class InvitesList extends React.Component {
    render() {
        let invites = this.props.invites;  
        var inviteName = {
            invite: []
        }
        let columns = [{
            Header: "Team Name",
            accessor: 'name'
        }, {
            Header: "Accept",
            accessor: 'id'
        }]

        invites.map((data) => {
            inviteName.invite.push({
                "id": data.id
            })
        })

        console.log(inviteName.invite)
        // if(invites) {
        //     if(invites.length === 0 || invites === "undefined") {
        //         invitesList = (
        //             <div className='text-center' style={{ paddingTop: '5vh', height: '130px', minWidth: '320px' }} >
        //                 You have no pending invites!
        //             </div>
        //         )
        //     } else {
        //         // invitesList = invites.map((data) => {
        //         //     return <InvitesBadge invite={data} key={data} />
        //         // })
        //     }
        // }
        return (
            <div>
                <h1>test</h1>
            </div>
        )
    }
}

@inject('invitesStore')
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
    }

    // handleInviteAccept(id) {
    //     this.props.invitesStore.
    // }

    render() {
        return(
                <div className='row'>
                    <h2 style={{ fontWeight:'bold' }}>Invites</h2>
                    <InvitesList invites={this.props.invitesStore.invites} />
                </div>
        )
    }
}