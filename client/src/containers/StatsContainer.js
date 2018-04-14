import { inject, observer } from 'mobx-react'
import React from 'react'
import { LoadingOverlay, Loader } from 'react-overlay-loader'

import Stats from '../components/dashboard/Stats'

import 'react-overlay-loader/styles.css'
import axios from 'axios/index'
import stores from '../stores'

@inject('submissionStore')
@observer
export default class StatsContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stats: []
    }
  }

  componentDidMount () {
    axios.get(process.env.REACT_APP_API_URL + '/stats/comp_sigh/ratio', {
      headers: {
        Authorization: `Bearer ${stores.authStore.token}`
      },
      params: {
        version: stores.authStore.version
      }
    }).then((response) => {
      this.setState({
        stats: response.data.stats
      })
    }, (err) => {
      console.error(err)
    })
  }
  render () {
    return (
      <LoadingOverlay>
        <Stats stats={this.state.stats} />
        <Loader loading={this.props.submissionStore.isLoading} />
      </LoadingOverlay>
    )
  }
}