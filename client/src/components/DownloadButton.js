import React from 'react'
import axios from 'axios'
const fileDownload = require('js-file-download')
const isBinaryFile = require('isbinaryfile')

export default class DownloadButton extends React.Component {

  getFile(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          const data = response.data
          const buffer = new Buffer(data)
          isBinaryFile(buffer, 10000, (err, result) => {
            return resolve({
              file: data,
              isBinary: result
            })
          })
          // const isBinary = /\%u0000/.test(data)
        }).catch((err) => {
        return reject(err)
      })
    })
  }

  render() {

    if ((/\.(gz|zip|tar)$/i).test(this.props.url)) {
      return (
        <div onClick={() => {
        this.getFile(this.props.url).then((result) => {
          const decompressedName = this.props.url.match(/.*\/(.*)\.gz/)[1]
          const compressedName = this.props.url.match(/.*\/(.*\.gz)/)[1]
          let file = result.file
          if (result.isBinary) {
            const array = new Uint8Array(file.length);
            for (let i = 0; i < file.length; i++){
              array[i] = file.charCodeAt(i);
            }
            file = new Blob([array], {type: 'application/gzip'});
          }
          fileDownload(file, result.isBinary ? compressedName : decompressedName )
        })
      }} style={{ fontWeight: 'bold' }}>
        {this.props.html}
        </div>
      )

    }
    else {
      return <a href={this.props.url} download="recent-log.txt" style={{fontWeight: 'bold'}}>Build Log</a>
    }
  }
}