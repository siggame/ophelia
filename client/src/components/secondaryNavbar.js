import { inject } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

@inject('authStore')
export default class SecondNavBar extends React.Component {
  render () {
    let rightSection

    if (this.props.authStore.isUserLoggedIn) {
      // If the user is logged in, they should have different buttons over on the right side.
      rightSection = (
        <ul className='nav navbar-nav'>
          <li><Link className='login-button' to='/dashboard'>Dashboard</Link></li>
          <li><Link to={`/profile/${this.props.authStore.username}`}>Profile</Link></li>
          <li><Link to='/teams'>Invites</Link></li>
          <li><Link to='/create-team'>Teams</Link></li>
        </ul>
      )
    }

    return (
        <div>
            {this.props.authStore.isUserLoggedIn ?
            <nav className='navbar second-navbar'>
                <div className='container'>
                    {rightSection}
                </div>
            </nav>
            : 
                <div></div>
            }
        </div>
    )
  }
}
