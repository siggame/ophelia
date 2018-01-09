import React from 'react'
import axios from 'axios'
import Register from '../components/Register'

export default class RegisterContainer extends React.Component {
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
        <Register currentUsernames={this.state.currentUsernames} />
      </div>
    )
  }
}
