import { observer, inject } from 'mobx-react'
import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import NavBar from './components/NavBar'
import LandingPageContainer from './containers/LandingPageContainer'
import DashboardContainer from './containers/DashboardContainer'
import ProfileContainer from './containers/ProfileContainer'
import RegisterContainer from './containers/RegisterContainer'
import LoginContainer from './containers/LoginContainer'
import LogoutContainer from './containers/LogoutContainer'

@withRouter
@inject('authStore')
@observer
export default class App extends React.Component {
  async componentDidMount () {
    const { authStore } = this.props
    if (authStore.token) {
      await authStore.getCurrentUser()
    }
  }

  render () {
    return (
      <div>
        <NavBar />
        <main>
          <Switch>
            <Route exact path='/' component={LandingPageContainer} />
            <Route exact path='/dashboard' component={DashboardContainer} />
            <Route exact path='/profile/:teamId' component={ProfileContainer} />
            <Route exact path='/register' component={RegisterContainer} />
            <Route exact path='/login' component={LoginContainer} />
            <Route exact path='/logout' component={LogoutContainer} />
          </Switch>
        </main>

        <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' />
        <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa' crossOrigin='anonymous' />
      </div>
    )
  }
}
