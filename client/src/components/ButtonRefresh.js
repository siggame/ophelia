import React from 'react'

/**
 * ButtonRefresh - used to refresh the current game status
 *
 * Props:
 * buttonOnClick - Prop is called when the refresh button is clicked on
 */

export default class ButtonRefresh extends React.Component {
  render () {
    return (
      <button className='btn btn-success' onClick={this.props.buttonOnClick}>Refresh</button>
    )
  }
}

ButtonRefresh.defaultProps = {
  buttonOnClick: alert.bind(null, 'Make me do something!')
}
