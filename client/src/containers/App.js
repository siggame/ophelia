import React from 'react'
import { Route, Switch } from 'react-router-dom'

import NavBar from '../components/common/navbar'
import LandingPage from '../components/LandingPage'
import Dashboard from './dashboard/dashboard'
import Profile from './profile/profile'
import Signup from '../components/signup/signup'

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
            <Route path='/signup' component={Signup} />
          </Switch>
        </main>

        <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' />
        <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' integrity='sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa' crossorigin='anonymous' />
      </div>
    )
  }
}
