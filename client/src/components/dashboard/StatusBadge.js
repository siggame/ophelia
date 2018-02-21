import React from 'react'

export default class StatusBadge extends React.Component {
  render () {
    const backgroundStyle = {}
    // TODO: Get proper states from the arena backend
    switch (this.props.Status) {
      case 'Success':
        backgroundStyle.backgroundColor = 'green'
        break
      default:
        backgroundStyle.backgroundColor = '#999999'
    }

    return (
      <div className={this.props.BadgeStyle} style={backgroundStyle}>
        {this.props.Status}
      </div>
    )
  }
}
