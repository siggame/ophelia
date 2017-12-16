import React, { Component } from 'react'

export default class LandingPage extends Component {
  render () {
    return (
      <div>
        <div className='jumbotron'>
          <div className='container'>
            <h1>MegaminerAI</h1>
            <p>Some sample text to see how this looks.</p>
          </div>
        </div>
        <div className='row' >
          <div className='col-lg-6'>
            <h3>Visit our Blog at <a href='https://medium.com/siggame'>Medium</a>.</h3>
          </div>
          <div className='col-lg-6'>
            <h3>View current server status <a href='http://status.megaminerai.com'>here</a>.</h3>
          </div>
        </div>
      </div>
    )
  }
}
