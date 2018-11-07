import { distanceInWords } from 'date-fns'
import React, { Component } from 'react'
import DownloadButton from '../components/DownloadButton.js'
import { Link } from 'react-router-dom'


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
  render () {
    let bgColor = ''
    // The Background Color of the div should be different based on what the result of the game
    switch (this.props.status) {
      case 'Won':
        bgColor = 'green'
        break
      case 'Lost':
        bgColor = '#c10303'
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
      <svg style={{verticalAlign: 'middle', width: '60px', height: '60px', margin: '50% 5px 50% 5px' }} viewBox='0 0 69 69' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
        <g id='Canvas' transform='translate(-26 92)'>
          <g id='Group 2'>
            <g id='Viz Link Button'>
              <use xlinkHref='#path0_fill' transform='translate(26 -92)' id ='playButton' fill='#666666' />
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
      <svg style = {{verticalAlign: 'middle', width: 42, height: 52 }} version='1.1' viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <path id="logButton" fill="#111" d="M34,11.12V6.58a4.5,4.5,0,0,0-4.5-4.5h-16A4.5,4.5,0,0,0,9,6.58v23a2.5,2.5,0,1,1-5,0V26H7.19V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5V13.13h-2V29.54a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54Zm-4.5-7A2.5,2.5,0,0,1,32,6.58V9.12H18V6.58a4.48,4.48,0,0,0-.76-2.5Z" className="clr-i-outline clr-i-outline-path-1"/>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0"/>
            </svg>
    )

    const noButtonVector = (<p />)
    let logButton = (noButtonVector)
    if (this.props.clientLogUrl !== null) {
      logButton = (
          <DownloadButton
            url={this.props.clientLogUrl}
            html={<a style={{cursor: 'pointer', marginTop: '50%'}}>{logButtonVector}</a>}
          />
      )
    }
    let vizLink = (noButtonVector)
    var re = new RegExp('(storage\/).*')
    var logUrl = re.exec(this.props.logUrl)
    // Use let logUrl = this.props.logUrl.match(/storage\/(.*)/)[1] // if we don't need the storage part (and remove index part below)
    if (this.props.logUrl !== null) {
      let visUrl = 'http://vis.siggame.io?log=' + logUrl[0]
      vizLink = (
        <a href={visUrl} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} target='_blank'>
          {playButtonVector}
        </a>
      )
    }

    const opponentLink = (
      <Link
        style={{textDecoration: 'none', color: bgColor}}
        to={'/profile/' + this.props.opponent } >
        {this.props.opponent}
        </Link>
    )

    return (
      <div style={{ border: '1px solid ' + bgColor, borderLeft:'10px solid red', borderLeftColor: bgColor, margin: 10, marginRight: 0, minWidth: '320px', paddingRight: 10 }} className='row  gutter-10'>
          <div style={{height:'90px'}} >
            <div className='row gutter-10'>
              <div className='col-xs-4 col-sm-4 text-center' style={{ height: '100%' }}>
                <div className='row'>
                  <div  style={{ paddingTop: '10px', fontSize: 16 }} >Opponent:
                  </div>
                  <div className='col-xs-12 text-center' style={{ height: '80%' }}>
                    <div className='ellipsis' style={{ marginTop: '9%', marginLeft: '20px', fontSize: 18, fontWeight: 'bold'}} >{opponentLink}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-xs-3 col-sm-4 text-center' style={{ height: '100%', overflow: 'hidden' }}>
                <div style={{ paddingTop: '4px' }}><span style={{ fontStyle: 'bold', color: bgColor, fontSize: 28 }}>{this.props.status}</span> <span className='hidden-xs' style={{ fontStyle: 'italic', fontSize: 12, wordWrap: 'none' }}>{'(' + updatedTime + ')'}</span>
                </div>
                <div className='ellipsis' style={{ padding: '6% 0 1vh 0', fontSize: 13, color: 'black' }}>{this.props.description}
                </div>
              </div>
              <div className='col-xs-2 col-sm-2 text-center' style={{ height: '100%'}}>
                <div style={{ marginTop: '36px' }}><p  style={{ fontStyle: 'italic', fontSize: 21 }}>v. {this.props.version}</p>
                </div>
              </div>
              <div className='col-sm-1 text-center hidden' style={{ height: '100%', lineHeight: '100%' }}>
                  {logButtonVector}
              </div>
              <div className='col-xs-3 col-sm-2 text-center' style={{ height: '100%', lineHeight: '100%', paddingRight: '10px', width: '60px', align: 'center'}} >
                {vizLink}
              </div>
            </div>
          </div>
          <div className='col-xs-12 text-center' style={{margin: '0 10px 5px 10px', width: '98%', borderTop: '1px solid #f5f5f5'}} >
            <a href={'#more-detail-id-' + this.props.id } style={{textDecoration: 'none'}} data-toggle="collapse" ><span>Full Detail and Download <span style={{ fontSize: 10}} className='glyphicon glyphicon-chevron-down'/></span></a>
          </div>
          <div className='col-xs-12 text-center collapse' id={'more-detail-id-' + this.props.id }>
            <div style={{marginLeft: '10px', marginRight: '10px', marginTop: '10px', borderTop: '1px solid #dddddd', paddingTop: '10px'}} className='row no-gutter'>
              <div className='col-xs-12' style={{ paddingBottom:'10px' }} >
                <div className='row no-gutter' >
                  <div className='col-xs-3' >
                    <span style={{fontStyle: 'italic', fontWeight: 'lighter' }} >{ updatedTime }</span>
                  </div>
                  <div className='col-xs-6' >
                    <span style={{ fontWeight: 'bold', textDecoration: 'underline', color: bgColor}} >Game {this.props.status}!</span>
                  </div>
                  <div className='col-xs-3' >
                    <span style={{fontStyle: 'italic' }} >Client Log Download:</span>
                  </div>
                </div>
              </div>
            <div className='row'>
              <div className='col-xs-10 ellipsis text-left' >
                <div className='row'>
                  <div className='col-xs-12'>
                    <span style={{fontStyle: 'italic'}} >Opponent:</span> <span style={{ textAlign: 'center', fontWeight: 'bold'}} >{opponentLink}</span>
                  </div>
                  <div className='col-xs-12'>
                    <div className='row' >
                      <div className='col-sm-6'>
                          <span style={{fontStyle: 'italic'}} >Code Version: </span> <span style={{ textAlign: 'center' }} >{this.props.version}</span>
                      </div>
                      <div className='col-sm-6'>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-xs-2' style={{ height: '30px'}} >
                  {logButton}
              </div>
            </div>
            <div className='col-xs-12 text-left'>
              <span style={{fontStyle: 'italic'}} >Description:</span> <br/>
              <blockquote style={{ borderColor: '#f5f5f5', fontSize: 15}} >{this.props.description}</blockquote>
            </div>
          </div>
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