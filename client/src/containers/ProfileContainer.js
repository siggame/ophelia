import React from 'react'
import { inject, observer } from 'mobx-react'
import { Loader } from 'react-overlay-loader'

import EditProfile from '../components/profile/EditProfile'
import Profile from '../components/profile/Profile'

@inject('authStore')
@observer
export default class ProfileContainer extends React.Component {
  componentWillUnmount () {
    this.props.authStore.clearErrors()
  }

  isLoggedInUsersProfile = userId => userId === this.props.authStore.userId

  render () {
    const { authStore: { user } } = this.props
    const paramsTeamId = parseInt(this.props.match.params.teamId, 10)

    return (
      <React.Fragment>
        {!user ? <Loader />
          : this.isLoggedInUsersProfile(paramsTeamId) ? (
            <EditProfile />
          ) : (
            <Profile name={''} email={''} teamName={''} />
          )}
      </React.Fragment>
    )
  }
}
