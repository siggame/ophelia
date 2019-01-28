import React from 'react'
import GamesContainer from '../../containers/GamesContainer'
import SubmissionContainer from '../../containers/SubmissionContainer'
import StatsContainer from '../../containers/StatsContainer'
import { inject } from 'mobx-react'
import { Link } from 'react-router-dom'
import axios from 'axios';

@inject('authStore')
export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = { teamname: '' }
  }
  componentDidMount() {
        // Work around because I couldn't call this.props.authStore.user.teamName
        // This should be fixed in the future
        axios.get(`${process.env.REACT_APP_API_URL}/users/${this.props.authStore.userId}`).then((response) => {
          this.setState({
              userTeamName: response.data.user.teamName
          })
      })
  }

  render () {
    return (
      <div>
      {this.state.userTeamName === null ?
        <div>
          <h3>You need a team name in order to see the dashboard and upload code!</h3>
          <h4>Visit <Link to='/create-team'>teams</Link> in order to create a team or <Link to='/teams'>invites</Link> to join a team.</h4>
        </div>
        :
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
      }
      </div>
    )
    }
}
