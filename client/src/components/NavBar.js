import React from 'react'
import { inject } from 'mobx-react'

export default inject('authStore')(class NavBar extends React.Component {
  render () {
    let rightSection = (
      <ul className='nav navbar-nav navbar-right'>
        <li><a href='/register'>Register</a></li>
        <li><a className='login-button' href='/login'>Log In</a></li>
      </ul>
    )

    if (this.props.authStore.username) {
      // If the user is logged in, they should have different buttons over on the right side.
      rightSection = (
        <ul className='nav navbar-nav navbar-right'>
          <li><a href='/logout'>Log Out</a></li>
          <li><a className='login-button' href='/dashboard'>Dashboard</a></li>
        </ul>
      )
    }

    return (
      <nav className='navbar navbar-default navbar-fixed-top'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar' />
              <span className='icon-bar' />
              <span className='icon-bar' />
            </button>
            <a className='navbar-brand' href='/'>MegaminerAI</a>
          </div>
          <div id='navbar' className='collapse navbar-collapse'>
            <ul className='nav navbar-nav navbar-left'>
              <li><a href='/dashboard'>Dashboard</a></li>
            </ul>
            {rightSection}
          </div>
        </div>
      </nav>
    )
  }
})
