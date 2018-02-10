import React, { Component } from 'react'

/**
 * GameBadge - used to display concise results of a game played in the Arena.
 *
 * Props:
 * opponentName - name of the opponent faced in the arena
 * result - should either be 'Win' or 'Lose'
 * description - The reason for the win/loss
 * gameId - Identifier used to link to the gamelog
 */
export default class GameBadge extends Component {
  constructor (props) {
    super(props)

    this.state = {
      buttonActive: false
    }

    this.toggleHover = this.toggleHover.bind(this)
  }

  toggleHover () {
    // TODO: Consider handling this via CSS
    this.setState({
      buttonActive: !this.state.buttonActive
    })
  }

  render () {
    let bgColor = ''
    // The Background Color of the div should be different based on what the result of the game
    switch (this.props.result) {
      case 'Won':
        bgColor = '#2ecc71'
        break
      case 'Lost':
        bgColor = '#e74c3c'
        break
      case 'Queued':
        bgColor = '#f1c40f'
        break
      default:
        bgColor = '#cccccc'
        break
    }

    // This code looks really crazy, but it's rendering the purple play button on the right side of the badge.
    // SVGs are nice because the browser renders them and they don't get pixellated as you zoom in.
    const playButtonVector = (
      <svg style={{ verticalAlign: 'middle', width: '8vh', height: '8vh' }} viewBox='0 0 69 69' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
        <g id='Canvas' transform='translate(-26 92)'>
          <g id='Group 2'>
            <g id='Viz Link Button'>
              <use xlinkHref='#path0_fill' transform='translate(26 -92)' fill={this.state.buttonActive ? '#666666' : '#999999'} />
            </g>
            <g id='Group'>
              <g id='x33 56. Play'>
                <g id='Group'>
                  <g id='Vector'>
                    <use xlinkHref='#path1_fill' transform='translate(38 -80)' fill='#FFFFFF' />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <defs>
          <path id='path0_fill' d='M 0 0L 69 0L 69 69L 0 69L 0 0Z' />
          <path id='path1_fill' d='M 41.9816 11.2517C 35.7695 0.491916 22.0105 -3.19489 11.2517 3.01842C 0.492018 9.22972 -3.19489 22.9883 3.01835 33.7477C 9.22958 44.5075 22.9881 48.1949 33.7471 41.9821C 44.5069 35.7687 48.1955 22.0108 41.9816 11.2517ZM 31.498 38.0844C 22.8916 43.0552 11.8837 40.1056 6.91444 31.4973C 1.94403 22.8907 4.89461 11.8829 13.5014 6.91456C 22.1084 1.94409 33.1157 4.89342 38.0852 13.5014C 43.0549 22.1093 40.1052 33.1148 31.498 38.0844ZM 30.5984 21.5856L 18.8187 14.7153C 17.7452 14.0886 16.8793 14.5896 16.8854 15.8313L 16.9457 29.4681C 16.9511 30.7095 17.8276 31.2149 18.9042 30.593L 30.5938 23.844C 31.6692 23.2233 31.6715 22.2123 30.5984 21.5856Z' />
        </defs>
      </svg>
    )

    return (
      <div style={{ backgroundColor: bgColor, margin: 10, height: '10vh' }} className='row'>
        <div className='col-md-4' style={{ height: '100%' }}>
          <div style={{ lineHeight: '10vh', fontSize: 26 }} >{this.props.opponent}</div>
        </div>
        <div className='col-md-6' style={{ height: '100%', overflow: 'hidden' }}>
          <h3>{this.props.status}</h3>
          <p>{this.props.description}</p>
        </div>
        <div className='col-md-2' style={{ height: '100%', lineHeight: '10vh' }} >
          <a href={this.props.logUrl} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
            {playButtonVector}
          </a>
        </div>
      </div>
    )
  }
}

GameBadge.defaultProps = {
  opponent: '',
  status: '',
  description: '',
  logUrl: '',
  id: ''
}
