import React from 'react'

/**
 * ButtonRefresh - used to refresh the current game status
 *
 * Props:
 * buttonOnClick - Prop is called when the refresh button is clicked on
 * disabled - Prop is called if button disabled = true
 */

export default class ButtonRefresh extends React.Component {
  render () {
    if (this.props.disabled) {
      return (
        <button className='btn btn-success' disabled='disabled'>Refresh</button>
      )
    }
    return (
      <button className='btn btn-success' onClick={this.props.buttonOnClick}>Refresh</button>
    )
  }
}

ButtonRefresh.defaultProps = {
  buttonOnClick: alert.bind(null, 'Make me do something!'),
  disabled: false
}
