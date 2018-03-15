import { distanceInWords } from 'date-fns'
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
    switch (this.props.status) {
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

    // Display human readable time
    let updatedDate = new Date(this.props.updatedAt)
    let updatedTime = distanceInWords(new Date(), updatedDate, { addSuffix: true })

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

    const logButtonVector = (
      <svg style = {{verticalAlign: 'middle', width: '21', height: '21'}} version='1.1' viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <path id="logButton" fill="#111" d="M34,11.12V6.58a4.5,4.5,0,0,0-4.5-4.5h-16A4.5,4.5,0,0,0,9,6.58v23a2.5,2.5,0,1,1-5,0V26H7.19V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5V13.13h-2V29.54a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54Zm-4.5-7A2.5,2.5,0,0,1,32,6.58V9.12H18V6.58a4.48,4.48,0,0,0-.76-2.5Z" className="clr-i-outline clr-i-outline-path-1"></path>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0"/>
            </svg>
    )
    let visUrl = 'http://vis.siggame.io?log=' + this.props.logUrl

    return (
      <div style={{ backgroundColor: bgColor, margin: 10, height: '10vh' }} className='row'>
        <div className='col-xs-3 text-center' style={{ height: '100%' }}>
          <div style={{ lineHeight: '10vh', fontSize: 26 }} >{this.props.opponent}</div>
        </div>
        <div className='col-xs-5 text-center' style={{ height: '100%', overflow: 'hidden' }}>
          <div style={{ paddingTop: '2vh' }}><span style={{ fontSize: 20 }}>{this.props.status}</span> <span style={{ fontStyle: 'italic' }}>{'(' + updatedTime + ')'}</span></div>
          <div style={{ padding: '1vh 0 1vh 0', fontSize: 13 }}>{this.props.description}</div>
        </div>
        <div className='col-xs-1 text-center' style={{ height: '100%', overflow: 'hidden' }}>
          <div style={{ lineHeight: '10vh', fontSize: 26 }}>{this.props.version}</div>
        </div>
        <div className='col-xs-1 text-center' style={{ height: '100%', lineHeight: '10vh' }}>
          <a href={this.props.clientLogUrl} download>
            {logButtonVector}
          </a>
        </div>
        <div className='col-xs-2 text-center' style={{ height: '100%', lineHeight: '10vh' }} >
          <a href={visUrl} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} target='_blank'>
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
  id: '',
  version: '',
  createdAt: '',
  updatedAt: ''
}
