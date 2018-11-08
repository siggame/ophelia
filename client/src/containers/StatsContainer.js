import { inject, observer } from 'mobx-react'
import React from 'react'
import Stats from '../components/dashboard/stats'


@inject('authStore')
@observer
export default class StatsContainer extends React.Component {
    render() {
        return (
            <Stats userInfo={this.props.authStore.user}/>
        )
    }
}