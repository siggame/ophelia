import React from 'react'
import PropTypes from 'prop-types'

const Profile = ({ username, teamName, bio, imageUrl }) => (
  <div>
    <div className='row'>
      <div className='col-md-4 col-md-offset-4'>
        <div className='page-header'>
          <h1>{username}</h1>
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-4'>
        <div className='thumbnail'>
          <img src={imageUrl} alt={username} />
        </div>
      </div>
      <div className='col-md-8'>
        <dl className='dl-horizontal'>
          <dt>Team Name</dt>
          <dd>
            {teamName === '' ? `${username} is currently a F/A` : teamName}
          </dd>
        </dl>
        <dl className='dl-horizontal'>
          <dt>Bio</dt>
          <dd style={{overflowY: 'auto', maxHeight: 200, width: 'auto' }}>{bio}</dd>
        </dl>
      </div>
    </div>
  </div>
)

Profile.defaultProps = {
  teamName: '',
  bio: '',
  imageUrl: '' // TODO: Should we have a default image?
}

Profile.propTypes = {
  username: PropTypes.string.isRequired,
  teamName: PropTypes.string,
  bio: PropTypes.string,
  imageUrl: PropTypes.string
}

export default Profile
