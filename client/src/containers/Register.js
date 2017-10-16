import React from 'react'
import axios from 'axios'
import SignupView from '../components/RegisterView'

export default class Register extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentUsernames: [],
      currentEmails: []
    }
  }

  componentDidMount () {
    axios.get('/users/').then((response) => {
      this.setState({
        currentUsernames: response.data.users
      })
    }, (err) => {
      console.error(err)
    })
  }

  render () {
    return (
      <div>
        <SignupView currentUsernames={this.state.currentUsernames} />
      </div>
    )
  }
}
