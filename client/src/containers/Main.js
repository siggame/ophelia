import React from 'react'
import {Route, Switch} from 'react-router-dom'

import LandingPage from '../components/LandingPage'
import Dashboard from './dashboard/dashboard'

export default class Main extends React.Component {
  render () {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/dashboard' component={Dashboard} />
        </Switch>
      </main>
    )
  }
}
