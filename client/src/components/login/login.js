import React from 'react'

export default class Login extends React.Component {
  render () {
    return (
      <div>
        <div className='col-md-3 col-md-offset-4'>
          <div className='form-group'>
            <h3>Sign In:</h3>
            <form>
              <label for='inputUsername'>Username</label><br />
              <input type='username' className='form-control' id='inputUsername' placeholder='Username' />
            </form>
          </div>
          <div class='form-group'>
            <label for='inputPassword'>Password</label><br />
            <input type='password' className='form-control' id='inputPassword' placeholder='Password' />
          </div>
          <br /><button type='submit' className='btn btn-default'>Submit</button>
        </div>
      </div>
    )
  }
}
