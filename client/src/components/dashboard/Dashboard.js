import React from 'react'
import Profile from '../profile/Profile'
import GamesContainer from '../../containers/GamesContainer'
import SubmissionInfo from './SubmissionInfo'

export default class Dashboard extends React.Component {
  render () {
    return (
      <div className='row'>
        <div className='col-lg-6'>
          <GamesContainer />
        </div>
        <div className='col-lg-6' >
          <div className='submission'>
            <SubmissionInfo />
          </div>
          <div className='profile'>
            <Profile />
          </div>
        </div>
      </div>
    )
  }
}
