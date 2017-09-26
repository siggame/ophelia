import React from 'react'

export default class Profile extends React.Component {
  render () {
    const styleBold = {
      fontWeight: 'bold'
    }
    return (
      <div>
        <h1>{this.props.teamName} </h1>
        <p style={styleBold}> {this.props.primaryContactName} </p>
        <p><span style={styleBold}>Email: </span>{this.props.primaryContactEmail} </p>
      </div>
    )
  }
}

Profile.defaultProps = {
  teamName: '',
  primaryContactName: '',
  primaryContactEmail: ''
}
