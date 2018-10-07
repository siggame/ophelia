import React from 'react'
import { inject, observer } from 'mobx-react'
import ShowTeams from '../components/teams/ShowTeams';
import { LoadingOverlay, Loader } from 'react-overlay-loader'


@inject('teamStore')
@observer
export default class TeamsContainer extends React.Component {

    render() {
        return(
            <LoadingOverlay>
                <div className="col-md-6"><ShowTeams /></div>
                <Loader loading={this.props.teamStore.isLoading} />
            </LoadingOverlay>
        )
    }
}