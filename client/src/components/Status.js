import React from 'react'

export default class Status extends React.Component {
  render () {
    console.log('Props', this.props)
    return (
        <div>{'this.props.entries.arena.link'}</div>
    )
  }
}