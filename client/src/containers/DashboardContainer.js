import { inject, observer } from 'mobx-react'
import React from 'react'
import { Redirect } from 'react-router-dom'

import Dashboard from '../components/dashboard/Dashboard'

@inject('authStore', 'gameStore', 'submissionStore')
@observer
export default class DashboardContainer extends React.Component {
  componentWillMount () {
    if(this.props.authStore.isUserLoggedIn) {
      if (!this.props.gameStore.lastUpdated) {
        this.props.gameStore.makeDataStale()
      }
      if (!this.props.submissionStore.lastUpdated) {
        this.props.submissionStore.makeDataStale()
      }
    }
  }

  render () {
    if (!this.props.authStore.isUserLoggedIn) {
      return <Redirect to='/login' />
    }
    return <Dashboard />
  }
}
