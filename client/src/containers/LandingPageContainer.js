import { inject, observer } from 'mobx-react'
import React from 'react'
import { Redirect } from 'react-router'


import LandingPage from '../components/LandingPage'

@inject('authStore')
@observer
export default class LandingPageContainer extends React.Component {
  render () {
    // FOR CHESS: Since the landing page looks like crap right now, go ahead and redirect them to the Dashboard,
    // since that's where they'll want to be regardless. This won't be the case once we go into MMAI or the landing page looks better.
    if (this.props.authStore.isUserLoggedIn) {
      return <Redirect to='/dashboard' />
    }
    return (
      <LandingPage />
    )
  }
}
