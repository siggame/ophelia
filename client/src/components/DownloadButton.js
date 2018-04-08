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
    return <a href="#" onClick={fileDownload.bind(this.getFile(this.props.url), 'filename.txt')} style={{ fontWeight: 'bold' }}>DOWNLOAD</a>
  }
}