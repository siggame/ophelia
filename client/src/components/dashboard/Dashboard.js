import React from 'react'

import Profile from '../profile/Profile'
import Games from './Games'
import SubmissionInfo from './SubmissionInfo'
import SubmissionBanner from './SubmissionBanner'

export default class Dashboard extends React.Component {
  render () {
    return (
		<div>
		  <SubmissionBanner uploadedDate={'2018-01-10T12:00:05'} />
		  <div className='row'>
			<div className='col-lg-6'>
			  <Games />
			</div>
			<div className='col-lg-6' >
			  <div className='submission'>
				<SubmissionInfo uploadedDate={'2018-01-10T12:00:05'} />
			  </div>
			  <div className='profile'>
				<Profile />
			  </div>
			</div>
		  </div>
		</div>
    )
  }
}
