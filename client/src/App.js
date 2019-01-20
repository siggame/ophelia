import { observer, inject } from 'mobx-react'
import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import NavBar from './components/NavBar'
import SecondNavBar from './components/secondaryNavbar'
import LandingPageContainer from './containers/LandingPageContainer'
import DashboardContainer from './containers/DashboardContainer'
import ProfileContainer from './containers/ProfileContainer'
import RegisterContainer from './containers/RegisterContainer'
import LoginContainer from './containers/LoginContainer'
import LogoutContainer from './containers/LogoutContainer'
import TeamCreation from './components/teams/TeamCreation'
import TeamsContainer from './containers/TeamsContainer'
import LeaderboardContainer from './containers/LeaderboardContainer'
import './styles/main.scss';

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
        <main className='container-fluid'>
          <Switch>
            <Route exact path='/' component={LandingPageContainer} />
            <Route exact path='/dashboard' component={DashboardContainer} />
            <Route exact path='/profile/:teamName' component={ProfileContainer} />
            <Route exact path='/register' component={RegisterContainer} />
            <Route exact path='/login' component={LoginContainer} />
            <Route exact path='/logout' component={LogoutContainer} />
            <Route exact path='/create-team' component={TeamCreation} />
            <Route exact path='/teams' component={TeamsContainer} />
            <Route exact path='/leaderboard' component={LeaderboardContainer} />
          </Switch>
        </main>

        <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' />
        <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa' crossOrigin='anonymous' />
      </div>
    )
  }
}
