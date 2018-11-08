import React from 'react'
import GamesContainer from '../../containers/GamesContainer'
import SubmissionContainer from '../../containers/SubmissionContainer'
import StatsContainer from '../../containers/StatsContainer'

export default class Dashboard extends React.Component {
  render () {
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
