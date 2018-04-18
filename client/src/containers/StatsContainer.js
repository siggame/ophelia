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
      stats: [],
      versionFiler: '',
      filterEnabled: false,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  getWinLossRatio (version) {
    return new Promise ((resolve, reject) => {
      axios.get(process.env.REACT_APP_API_URL + `stats/${stores.authStore.username}/ratio`,
        {
          headers: {
            Authorization: `Bearer ${stores.authStore.token}`
          },
          params: {
            version: version
          }
        }).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  handleFilterChange (e) {
    this.setState({
      versionFilter: e.target.value,
    })
    e.preventDefault()
    this.getWinLossRatio(e.target.value).then((response) => {
      this.setState({
        stats: response.data.stats
      })
    })
  }



  componentDidMount () {
    axios.get(process.env.REACT_APP_API_URL + `/stats/${stores.authStore.username}/ratio`, {
      headers: {
        Authorization: `Bearer ${stores.authStore.token}`
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
        <Stats stats={this.state.stats} handleFilterChange={this.handleFilterChange} />
        <Loader loading={this.props.submissionStore.isLoading} />
      </LoadingOverlay>
    )
  }
}