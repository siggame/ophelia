import React from 'react'

export default class AdminIndex extends React.Component {
  render () {
    let userList = this.props.users.map((username) => {
      
    })

    return (
      <div>
        <ul>
          {userList}
        </ul>
      </div>
    )
  }
}