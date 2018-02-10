import { inject } from 'mobx-react'
import React from 'react'
import { Loader } from 'react-overlay-loader'
import { Redirect } from 'react-router-dom'

import 'react-overlay-loader/styles.css'
export default inject('authStore')(class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      formSubmitted: false,
      hasErrors: true,
      loading: false,
      password: '',
      username: ''
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
    event.preventDefault()
    this.setState({ loading: true })
    this.props.authStore.logUserIn(this.state.username, this.state.password).then(() => {
      this.setState({
        formSubmitted: true,
        hasErrors: false
      })
    }).catch((err) => {
      // TODO: Actual Logging
      console.log('error logging in: ', err)
      this.setState({
        formSubmitted: true,
        loading: false
      })
    })
  }

  render () {
    let formError

    if (this.state.formSubmitted) {
      if (this.state.hasErrors) {
        formError = (
          <span style={{ color: 'red', marginLeft: 10 }}>Incorrect team name or password!</span>
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
        <div className='col-md-4 col-md-offset-4'>
          <h3>Log In</h3>
          <form>
            <div className='form-group'>
              <label htmlFor='username'>Team Name</label>
              {formError}
              <input type='text' className='form-control' name='username' placeholder='Team Name' value={this.state.username} onChange={this.handleChange} />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='password' className='form-control' name='password' placeholder='Password' value={this.state.password} onChange={this.handleChange} />
            </div>
            <button type='submit' onClick={this.handleSubmit} className='btn btn-default btn-block btn-lg' style={{marginTop: 32}}>Log In</button>
          </form>
        </div>
        <Loader loading={this.state.loading} fullPage />
      </div>
    )
  }
})
