import React from 'react'

import Profile from '../profile/profile'
import Games from './games'
import SubmissionInfo from './submission_info'

import '../main.css'

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
