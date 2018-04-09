import React from 'react'
import axios from 'axios'
const fileDownload = require('js-file-download')


export default class DownloadButton extends React.Component {

  getFile(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          return resolve(response.data)
        }).catch((err) => {
        return reject(err)
      })
    })
  }

  render() {

    if ((/\.(gz|zip)$/i).test(this.props.url)) {
      return (
        <a onClick={() => {
        this.getFile(this.props.url).then((file) => {
          fileDownload(file, 'filename.txt')
        })
      }} style={{ fontWeight: 'bold' }}>
        {this.props.html}
        </a>
      )

    }
    else {
      return <a href={this.props.url} download="recent-log.txt" style={{fontWeight: 'bold'}}>Build Log</a>
    }
  }
}