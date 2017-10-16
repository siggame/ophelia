import React from 'react'
import Auth from '../modules/auth'
import { Redirect } from 'react-router-dom'

export default class Logout extends React.Component {
  componentDidMount() {
    Auth.deauthenticateUser()
  }

  render() {
    return (
      <Redirect to={'/'} />
    )
  }
}