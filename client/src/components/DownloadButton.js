import React from 'react'
import axios from 'axios'
import stores from '../stores'
var fileDownload = require('js-file-download');

function getFile(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
      Authorization: `Bearer ${stores.authStore.token}`
    }
    }).then((response) => {
      console.log(response.data.body)
      return resolve(response.data.body)
    }).catch((err) => {
      return reject(err)
    })
  })
}



export default class DownloadButton extends React.Component {
  render() {
    // return fileDownload(data, 'filename.txt')
    return <a onClick={fileDownload(getFile(this.props.url), 'filename.txt')} style={{ fontWeight: 'bold' }}>DOWNLOAD</a>
  }
}