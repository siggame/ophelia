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
    console.log('DidMount')
    getCurrentStatus().then((data) => {
      console.log('Data', data)
      this.setState({
        entries: data
      })
    }).catch((err) => {
      console.log(err)
    })
  }
  render () {
    console.log('State', this.state)
    return (
      <div><Status entries={this.state.entries}/></div>
    )
  }
}