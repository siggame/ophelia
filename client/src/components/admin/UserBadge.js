import React from 'react'

export default class UserBadge extends React.Component {
  render () {
    return (
      <div className='row' key={this.props.username}>
        <div className='col-md-4'>
          <h1>{this.props.username}</h1>
        </div>
        <div className='col-md-4'>
          <div className='btn btn-success'>Mark Eligible</div>
        </div>
        <div className='col-md-4'>
          <div className='btn'>Make Admin</div>
        </div>
      </div>
    )
  }
}