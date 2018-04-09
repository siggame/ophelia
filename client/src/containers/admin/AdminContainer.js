import React from 'react'
import { inject } from 'mobx-react'
import axios from 'axios'

import AdminIndex from '../../components/admin/AdminIndex'

@inject('authStore')
export default class AdminContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentDidMount () {
    axios.get(process.env.REACT_APP_API_URL + '/users/', {
      headers: {
        Authorization: `Bearer ${this.props.authStore.token}`
      }
    }).then((response) => {
      if (response.data.success) {
        this.setState({
          users: response.data.users
        })
      } else {
        console.error('Request failed getting users')
      }
    }).catch((err) => {
      console.log('Error getting users:', err.message)
    })
  }

  render () {
    return (
      <div>
        <AdminIndex users={this.state.users} />
      </div>
    )
  }
}