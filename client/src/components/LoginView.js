import React from 'react'
import { Redirect } from 'react-router-dom'
import { validateLogin } from '../modules/users'

export default class LoginView extends React.Component {
  constructor (props) {
    super(props)

     this.state = {
      username: '',
      password: '',
      formSubmitted: false,
      hasErrors: true,
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
    validateLogin(this.state.username, this.state.password).then((data) => {
      console.log('success', data)
    }, (err) => {
      console.log(err)
    })
    event.preventDefault()
  }

  render () {
    let formError

    if (this.state.formSubmitted) {
      if (this.state.hasErrors) {
        formError = (
          <span style={{ color: 'red', marginLeft: 10 }}>Incorrect username or password!</span>
        )
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
              {formError}
              <input type='text' className='form-control' name='username' value={this.state.username} onChange={this.handleChange} />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='password' className='form-control' name='password' value={this.state.password} onChange={this.handleChange} />
            </div>
            <button type='submit' onClick={this.handleSubmit} className='btn btn-default'>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
