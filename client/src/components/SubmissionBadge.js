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
export default class SubmissionBadge extends Component {
  constructor (props) {
    super(props)

    this.state = {
      buttonActive: false
    }

    this.toggleHover = this.toggleHover.bind(this)
  }

  toggleHover () {
    this.setState({
      buttonActive: !this.state.buttonActive
    })
  }

  render () {
    let bgColor = ''
    switch (this.props.status) {
      case 'queued':
        bgColor = '#cccccc'
        break
      case 'building':
        bgColor = '#f1c40f'
        break
      case 'finished':
        bgColor = '#2ecc71'
        break
      default:
        bgColor = '#cccccc'
        break
    }

    // Display human readable time
    let updatedDate = new Date(this.props.updatedAt)
    let updatedTime = distanceInWords(new Date(), updatedDate, { addSuffix: true })

    const logIconVector = (
      <svg style={{ verticalAlign: 'middle', width: '8vh', height: '8vh' }} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 485.212 485.212" xmlSpace="preserve">
        <g>
          <path style={{ fill: 'grey' }} d="M424.56,90.978h-90.976V0L424.56,90.978z M454.887,121.304v363.908H30.325V0h272.928v121.304H454.887z M90.976,121.304 h181.955V90.978H90.976V121.304z M394.234,363.906H90.976v30.331h303.258V363.906z M394.234,272.93H90.976v30.327h303.258V272.93z M394.234,181.955H90.976v30.327h303.258V181.955z"/>
        </g>
      </svg>
    )

    return (
      <div style={{ backgroundColor: bgColor, margin: 10, height: '10vh' }} className='row'>
      <div className='col-xs-2 text-center' style={{ height: '100%' }}>
        <div style={{ lineHeight: '10vh', fontSize: 26 }} >{this.props.version}</div>
      </div>
      <div className='col-xs-8 text-center' style={{ height: '100%', overflow: 'hidden' }}>
        <div style={{ lineHeight: '10vh' }}><span style={{ fontSize: 20 }}>{this.props.status}</span> <span style={{ fontStyle: 'italic' }}>{'(' + updatedTime + ')'}</span></div>
      </div>
      <div className='col-xs-2 text-center' style={{ height: '100%', lineHeight: '10vh' }} >
        <a href={this.props.logUrl} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} target='_blank'>
          {logIconVector}
        </a>
      </div>
    </div>
    )

  }
}