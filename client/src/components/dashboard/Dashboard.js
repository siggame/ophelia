import React from 'react'
import Profile from '../profile/Profile'
import GamesContainer from '../../containers/GamesContainer'
import SubmissionContainer from '../../containers/SubmissionContainer'
// import SubmissionBanner from './SubmissionBanner'

export default class Dashboard extends React.Component {
  render () {
    return (
		<div>
		  <div className='row'>
			  <div className='col-lg-6'>
			    <GamesContainer />
			  </div>
			  <div className='col-lg-6' >
			    <div className='submission'>
				    <SubmissionContainer />
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
