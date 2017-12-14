import React from 'react'
import { Route, Switch } from 'react-router-dom'

import NavBar from '../components/NavBar'
import LandingPage from '../components/LandingPage'
import Dashboard from './dashboard/dashboard'
import Profile from './profile/profile'
import Register from './Register'
import Login from '../containers/Login'
import Logout from './Logout'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <NavBar />
        <main>
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/dashboard' component={Dashboard} />
            <Route path='/profile/:teamId' component={Profile} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/logout' component={Logout} />
          </Switch>
        </main>

        <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' />
        <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa' crossOrigin='anonymous' />
      </div>
    )
  }
}
