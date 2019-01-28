import React from 'react'
import GamesContainer from '../../containers/GamesContainer'
import SubmissionContainer from '../../containers/SubmissionContainer'
import StatsContainer from '../../containers/StatsContainer'
import { inject } from 'mobx-react'
import { Link } from 'react-router-dom'

@inject('authStore')
export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    if(!this.props.authStore.teamName) {
      return (
        <div>
          <h3>You need a team name in order to see the dashboard and upload code!</h3>
          <h4>Visit <Link to='/create-team'>teams</Link> in order to create a team or <Link to='/teams'>invites</Link> to join a team.</h4>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className='row'>
            <div className='col-md-6'>
              <GamesContainer />
            </div>
            <div className='col-md-6'>
              <div className='submission'>
                <SubmissionContainer />
                <StatsContainer />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
