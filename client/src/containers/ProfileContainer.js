import React from 'react'
import { inject } from 'mobx-react'

import EditProfile from '../components/profile/EditProfile'
import Profile from '../components/profile/Profile'

@inject('authStore')
export default class ProfileContainer extends React.Component {
  isLoggedInUsersProfile = userId => {
    return userId === this.props.authStore.userId
  }

  render () {
    const bio =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum elit ac vestibulum sodales. Mauris tempor consectetur mi nec tempor. Etiam fermentum maximus lacus, quis interdum ligula lacinia ac. Maecenas sagittis metus quis sem feugiat ultricies.'
    return (
      <div className='container'>
        {this.isLoggedInUsersProfile(parseInt(this.props.match.params.userId, 10)) ? (
          <EditProfile username={'username'} teamName={'dummyTeamName'} bio={bio} email={'me@me.com'} name={'dummy name'} imageUrl={''} />
        ) : (
          <Profile username={'other user'} teamName={'other team'} bio={bio} imageUrl={''} />
        )}
      </div>
    )
  }
}
