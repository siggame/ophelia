import { inject, observer } from 'mobx-react'
import React from 'react'
import axios from 'axios'
import ButtonRefresh from '../ButtonRefresh'
import ReactPaginate from 'react-paginate'

export class InvitesList extends React.Component {
    render() {
        let invites = this.props.invites;
        let invitesList;
        if(invites) {
            if(invites.length === 0) {
                invitesList = (
                    <div className='text-center' style={{ paddingTop: '5vh', height: '130px', minWidth: '320px' }} >
                        You have no pending invites!
                    </div>
                )
            } else {
                // invitesList = invites.map((data) => {
                //     return <InvitesBadge invite={data} key={data} />
                // })
            }
        }
        return (
            <div>
                {invitesList}
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
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount() {
        this.props.invitesStore.loadInvites()
    }

    handlePageClick(data) {
        // TODO: Add logic to accept invite
        this.props.invitesStore.loadInvites()
    }
    handleRefresh() {
        this.props.invitesStore.loadInvites()
    }

    render() {
        return(
            <div>
                <div className='row'>
                    <div className='col-xs-4'><h2 style={{ fontWeight:'bold' }}>Invites</h2></div>
                    <div className='col-xs-6' />
                    <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}><ButtonRefresh buttonOnClick={this.handleRefresh} /></div>
                </div>
            </div>
        )
    }
}