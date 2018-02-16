import { inject, observer } from 'mobx-react'
import React from 'react'
import { Redirect } from 'react-router-dom'

import Dashboard from '../components/dashboard/Dashboard'

@inject('authStore', 'gameStore')
@observer
export default class DashboardContainer extends React.Component {
  componentWillMount () {
    if (!this.props.gameStore.lastUpdated && this.props.authStore.isUserLoggedIn) {
      this.props.gameStore.makeDataStale()
    }
  }

  render () {
    if (!this.props.authStore.isUserLoggedIn) {
      return <Redirect to='/login' />
    }
    return <Dashboard />
  }
}
