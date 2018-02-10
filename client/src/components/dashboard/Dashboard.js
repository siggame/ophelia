import React from 'react'
import Profile from '../profile/Profile'
import Games from './Games'
import SubmissionInfo from './SubmissionInfo'
import ButtonRefresh from '../ButtonRefresh'

export default class Dashboard extends React.Component {
  render () {
    return (
      <div className='row'>
        <ButtonRefresh />
        <div className='col-lg-6'>
          <Games />
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
