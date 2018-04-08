import React from 'react'
import PropTypes from 'prop-types'

const Profile = ({ name, email, teamName }) => (
  <div>
    <div className='row'>
      <div className='col-md-4 col-md-offset-4'>
        <div className='page-header'>
          <h1>{teamName}</h1>
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-8 col-md-offset-2'>
        <dl className='dl-horizontal'>
          <dt>Team Name</dt>
          <dd>{teamName}</dd>
        </dl>
        <dl className='dl-horizontal'>
          <dt>Primary Contact Name</dt>
          <dd>{name}</dd>
        </dl>
        <dl className='dl-horizontal'>
          <dt>Primary Contact Email</dt>
          <dd>{email}</dd>
        </dl>
      </div>
    </div>
  </div>
)

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  teamName: PropTypes.string.isRequired
}

export default Profile
