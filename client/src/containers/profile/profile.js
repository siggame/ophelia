import React from 'react';

export default class Profile extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.teamName} </h1>
        <b>{this.props.primaryContactName} </b>
        <p><b>Email: </b>{this.props.primaryContactEmail} </p>
      </div>
    )
  }
}

Profile.defaultProps = {
  teamName: "",
  primaryContactName: "",
  primaryContactEmail: ""
}