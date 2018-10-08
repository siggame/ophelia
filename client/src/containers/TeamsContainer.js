import React from 'react'
import { inject, observer } from 'mobx-react'
import ShowTeams from '../components/teams/ShowTeams';
import ShowInvites from '../components/invites/ShowInvites';
import SendInvite from '../components/invites/SendInvite';
import { LoadingOverlay, Loader } from 'react-overlay-loader'


@inject('teamStore')
@observer
export default class TeamsContainer extends React.Component {

    render() {
        return(
            <LoadingOverlay>
                <div className="col-md-6"><ShowTeams /></div>
                <Loader loading={this.props.teamStore.isLoading} />
                <div className="row">
                    <div className="col-md-6"><ShowInvites /></div>
                    <div className="col-md-6"><SendInvite /></div>
                </div>
            </LoadingOverlay>
        )
    }
}