import React from 'react'

import Profile from '../profile/Profile'
import Games from './Games'
import SubmissionInfo from './SubmissionInfo'

export default class Dashboard extends React.Component {
  render () {
    return (
      <div className='grid dashboard-container'>
        <div className='games-grid'>
          <Games />
        </div>
        <div className='submission-grid'>
          <SubmissionInfo />
        </div>
        <div className='group-info-grid'>
          <Profile />
        </div>
        <br />
      </div>
    )
  }
}
