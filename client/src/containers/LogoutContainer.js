import React from 'react'
import Auth from '../modules/auth'
import { Redirect } from 'react-router-dom'

export default class LogoutContainer extends React.Component {
  componentDidMount () {
    Auth.deauthenticateUser()
  }

  render () {
    return (
      <Redirect to={'/'} />
    )
  }
}
