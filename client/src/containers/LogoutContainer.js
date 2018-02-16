import { inject } from 'mobx-react'
import React from 'react'
import { Redirect } from 'react-router-dom'

export default inject('authStore')(class LogoutContainer extends React.Component {
  componentDidMount () {
    this.props.authStore.logUserOut()
  }

  render () {
    return (
      <Redirect to={'/'} />
    )
  }
})
