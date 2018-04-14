import React from 'react'
import { inject, observer } from 'mobx-react'
import { Loader } from 'react-overlay-loader'

import EditProfile from '../components/profile/EditProfile'
import Profile from '../components/profile/Profile'

@inject('authStore', 'teamStore')
@observer
export default class ProfileContainer extends React.Component {
  async componentDidMount () {
    const paramsTeamName = this.props.match.params.teamName
    if (!this.isLoggedInUsersProfile(paramsTeamName)) {
      await this.props.teamStore.loadTeam(paramsTeamName)
    }
  }

  componentWillUnmount () {
    this.props.authStore.clearErrors()
  }

  isLoggedInUsersProfile = username => username === this.props.authStore.username

  render () {
    const { authStore: { user }, teamStore: { team } } = this.props
    const paramsTeamName = this.props.match.params.teamName

    if (!user) {
      return <Loader />
    }

    if (this.isLoggedInUsersProfile(paramsTeamName)) {
      return <EditProfile />
    } else {
      return (
        !team ? <Loader /> : <Profile name={team.contactName} email={team.contactEmail} teamName={team.name} />
      )
    }
  }
}
