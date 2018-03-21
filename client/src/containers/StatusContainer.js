import React from 'react'
import Status from '../components/Status'
import { getCurrentStatus } from '../modules/status'

export default class StatusContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      entries: {}
    }
  }
  componentDidMount() {
    getCurrentStatus().then((data) => {
      this.setState({
        entries: data
      })
    }).catch((err) => {
      console.log(err)
    })
  }
  render () {
    return (
      <div><Status entries={this.state.entries}/></div>
    )
  }
}