import React from 'react'
import { Redirect } from 'react-router-dom'

export default class LoginView extends React.Component {
  constructor (props) {
    super(props)

     this.state = {
      username: '',
      password: '',
      formSubmitted: false,
      hasErrors: true,
      formErrors: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /*
   *  handleChange - handles whenever text in the input values changes
   */
  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name


    this.setState({
      [name]: value
    })
  }

  handleSubmit (event) {
    alert('Hi!')
    event.preventDefault()
  }

  render () {
    let userError
    let passwordError

    if (this.state.formSubmitted) {
      if (this.state.hasErrors) {
        // render errors here
      } else {
        return (
          <div>
            <Redirect to={{ pathname: '/' }} />
          </div>
        )
      }
    }

    return (
      <div>
        <div className='col-md-3 col-md-offset-4'>
          <h3>Sign In:</h3>
          <form>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              {userError}
              <input type='text' className='form-control' name='username' value={this.state.username} onChange={this.handleChange} />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              {passwordError}
              <input type='password' className='form-control' name='password' value={this.state.password} onChange={this.handleChange} />
            </div>
            <button type='submit' onClick={this.handleSubmit} className='btn btn-default'>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
