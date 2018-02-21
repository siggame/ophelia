import React, { Component } from 'react'
import _ from 'lodash'
import { Loader } from 'react-overlay-loader'
import { Redirect } from 'react-router-dom'

import { validateSignup } from '../modules/users'

import 'react-overlay-loader/styles.css'
export default class RegisterView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      formErrors: {},
      formSubmitted: false,
      hasErrors: true,
      loading: false,
      password: '',
      passwordConfirm: '',
      realName: '',
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
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  /*
   *  handleSubmit - handles when the submit button is pressed. sends validation to backend,
   *  gives info back so we can redirect or display errors as needed
   */
  handleSubmit (event) {
    this.setState({ loading: true })
    validateSignup(this.state.username, this.state.realName, this.state.email, this.state.password,
      this.state.passwordConfirm).then(() => {
      this.setState({
        formSubmitted: true,
        hasErrors: false
      })
    }).catch((err) => {
      this.setState({
        formSubmitted: true,
        formErrors: err,
        loading: false
      })
    })
    // Prevents the default HTML behavior from happening, so we can control how the form is submitted.
    event.preventDefault()
  }

  render () {
    let userError
    let emailError
    let passwordError
    let confirmError
    let formError

    if (this.state.formSubmitted) {
      if (this.state.hasErrors) {
        _.each(this.state.formErrors, (value, key) => {
          switch (key) {
            case 'username':
              userError = (
                <span style={{ color: 'red', marginLeft: 10 }}>{value[0]}</span>
              )
              break
            case 'email':
              emailError = (
                <span style={{ color: 'red', marginLeft: 10 }}>{value[0]}</span>
              )
              break
            case 'password':
              passwordError = (
                <span style={{ color: 'red', marginLeft: 10 }}>{value[0]}</span>
              )
              break
            case 'confirmPassword':
              confirmError = (
                <span style={{ color: 'red', marginLeft: 10 }}>{value[0]}</span>
              )
              break
            case 'form':
              formError = (
                <span style={{ color: 'red' }}>{value[0]}</span>
              )
              break
            default:
              break
          }
        })
      } else {
        return (
          <div>
            <Redirect to={{ pathname: '/login' }} />
          </div>
        )
      }
    }

    // Some frontend validation to make registration a bit easier.
    // Don't think this will cause any issues, but if it does, can be removed.
    if (this.props.currentUsernames.indexOf(this.state.username) !== -1) {
      userError = (
        <span style={{ color: 'red', marginLeft: 10 }}>Team Name is already taken!</span>
      )
    }

    // TODO: Make inputs and errors into components
    return (
      <div className='col-md-4 col-md-offset-4'>
        <h3>Register</h3>
        <form>
          {formError}
          <div className='form-group'>
            <label htmlFor='username'>Team Name</label>
            {userError}
            <input type='text' className='form-control' name='username' placeholder='Team Name' value={this.state.username} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email Address</label>
            {emailError}
            <input type='email' className='form-control' name='email' placeholder='Email' value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='realName'>Primary Contact's Name</label>
            <input type='text' className='form-control' name='realName' placeholder='Primary Contact Name' value={this.state.realName} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            {passwordError}
            <input type='password' className='form-control' name='password' placeholder='Password' value={this.state.password} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='passwordConfirm'>Confirm Password</label>
            {confirmError}
            <input type='password' className='form-control' name='passwordConfirm' placeholder='Confirm Password' value={this.state.passwordConfirm} onChange={this.handleChange} />
          </div>
          <button type='submit' onClick={this.handleSubmit} className='btn btn-default btn-block btn-lg' style={{marginTop: 32}}>Register</button>
        </form>
        <Loader loading={this.state.loading} fullPage />
      </div>
    )
  }
}

RegisterView.defaultProps = {
  currentUsernames: [],
  competitionName: 'MegaminerAI'
}
