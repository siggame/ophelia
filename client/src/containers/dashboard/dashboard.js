import React from 'react'

import Profile from '../profile/profile'
import Games from './games'
import SubmissionInfo from './submission_info'

import '../main.css'

export default class Dashboard extends React.Component {
  render () {
    const teamName = 'testTeam'
    const primaryContactName = 'testName'
    const primaryContactEmail = 'testEmail'
    
    return (
      <div className='grid dashboard-container'>
        <div className='games-grid'>
          <Games />
        </div>
        <div className='submission-grid'>
          <SubmissionInfo />
        </div>
        <div className='group-info-grid'>
          <Profile teamName={teamName} primaryContactName={primaryContactName} primaryContactEmail={primaryContactEmail} />
        </div>
        <br />
      </div>
    )
  }
}
