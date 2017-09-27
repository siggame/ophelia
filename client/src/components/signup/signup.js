import React, { Component } from 'react'
import '../../containers/main.css'
import '../common/navbar.js'

export default class Signup extends Component {
  render () {
    return (
      <div className='container signup-box'>
        <h1>{'Sign up for ' + this.props.competitionName + '!'}</h1>
        <form action='/signup' method='post'>
          <div className='form-group'>
            <label for='teamName'>Team Name</label>
            <input type='teamName' className='form-control' id='teamName' placeholder='Team Name' />
          </div>
          <div className='form-group'>
            <label for='InputEmail'>Email Address</label>
            <input type='email' className='form-control' id='InputEmail' placeholder='Email' />
          </div>
          <div className='form-group'>
            <label for='primaryContactName'>Primary Contact's Name</label>
            <input type='primaryContactName' className='form-control' id='primaryContactName' placeholder='Primary Contact Name' />
          </div>
          <div className='form-group'>
            <label for='InputPassword'>Password</label>
            <input type='password' className='form-control' id='InputPassword' placeholder='Password' />
          </div>
          <div className='form-group'>
            <label for='ConfirmPassword'>Confirm Password</label>
            <input type='password' className='form-control' id='ConfirmPassword' placeholder='Confirm Password' />
          </div>
          <button type='submit' className='btn btn-default'>Submit</button>
        </form>
      </div>
    )
  }
}

Signup.defaultProps = {
  competitionName: 'MegaminerAI'
}
