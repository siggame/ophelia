import React from 'react'
import { inject, observer } from 'mobx-react'
import { Loader } from 'react-overlay-loader'

import EditProfile from '../components/profile/EditProfile'
import Profile from '../components/profile/Profile'

@inject('authStore', 'teamStore')
@observer
export default class ProfileContainer extends React.Component {
  async componentDidMount () {
    const paramsTeamId = parseInt(this.props.match.params.teamId, 10)
    if (!this.isLoggedInUsersProfile(paramsTeamId)) {
      await this.props.teamStore.loadTeam(paramsTeamId)
    }
  }

  componentWillUnmount () {
    this.props.authStore.clearErrors()
  }

  isLoggedInUsersProfile = userId => userId === this.props.authStore.userId

  render () {
    const { authStore: { user }, teamStore: { team } } = this.props
    const paramsTeamId = parseInt(this.props.match.params.teamId, 10)

    if (!user) {
      return <Loader />
    }

    if (this.isLoggedInUsersProfile(paramsTeamId)) {
      return <EditProfile />
    } else {
      return (
        !team ? <Loader /> : <Profile name={team.name} email={team.contactEmail} teamName={team.name} />
      )
    }
  }
}
