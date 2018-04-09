import React from 'react'
import axios from 'axios'
import stores from '../stores'
var fileDownload = require('js-file-download');




export default class DownloadButton extends React.Component {

  getFile(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          console.log(response.data.body)
          return resolve(response.data.body)
        }).catch((err) => {
        return reject(err)
      })
    })
  }

  render() {

    const logButtonVector = (
      <svg style = {{verticalAlign: 'middle', width: '21', height: '21'}} version='1.1' viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <path id="logButton" fill="#111" d="M34,11.12V6.58a4.5,4.5,0,0,0-4.5-4.5h-16A4.5,4.5,0,0,0,9,6.58v23a2.5,2.5,0,1,1-5,0V26H7.19V24H2v5.5A4.5,4.5,0,0,0,6.5,34H25.58a4.5,4.5,0,0,0,4.5-4.5V13.13h-2V29.54a2.5,2.5,0,0,1-2.5,2.5H10.24a4.47,4.47,0,0,0,.76-2.5v-23a2.5,2.5,0,0,1,5,0v4.54Zm-4.5-7A2.5,2.5,0,0,1,32,6.58V9.12H18V6.58a4.48,4.48,0,0,0-.76-2.5Z" className="clr-i-outline clr-i-outline-path-1"></path>
        <rect x="0" y="0" width="36" height="36" fillOpacity="0"/>
      </svg>
    )

    if ((/\.(gz|zip)$/i).test(this.props.url)) {
      return <a href="#" onClick={() => fileDownload(this.getFile(this.props.url), 'filename.txt')}>{logButtonVector}</a>

    }
    else {
      return <a href={this.props.url} download="recent-log.txt" style={{fontWeight: 'bold'}}>Build Log</a>
    }
  }
}