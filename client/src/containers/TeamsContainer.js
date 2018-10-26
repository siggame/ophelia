import React from 'react'
import { inject, observer } from 'mobx-react'
import ShowInvites from '../components/invites/ShowInvites';
import SendInvite from '../components/invites/SendInvite';


@inject('teamStore')
@observer
export default class TeamsContainer extends React.Component {

    render() {
        return(
                <div className="container">
                    <div className="col-md-4 col-md-offset-4"><SendInvite /></div>
                    <div className="col-md-6 col-md-offset-3"><ShowInvites /></div>
                </div>
        )
    }
}