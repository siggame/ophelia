import React from 'react'
import axios from 'axios'
const isBinaryFile = require('isbinaryfile')
const fileDownload = require('js-file-download')

export default class DownloadData extends React.Component {
	getFile(version) {
		console.log("this got called")
		return new Promise((resolve, reject) => {
			axios.get(process.env.REACT_APP_API_URL + '/submissions/' + version)
				.then((response) => {
					const data = response.data
					const buffer = new Buffer(data)
					isBinaryFile(buffer, 10000, (err, result) => {
						return resolve({
							file: data,
							isBinary: result
						})
					})
				}).catch((err) => {
					return reject(err)
				})
		})
	}

	render() {
		if (this.props.version) {
			return (
			  <div onClick={() => {
				  this.getFile(this.props.version).then((result) => {
					  let file = result.file
					  if(result.isBinary) {
						  const array = new Uint8Array(file.length)
						  for(let i = 0; i < file.length; i++) {
							  array[i] = file.charCodeAt(i);
						  }
						  console.log(array)
						  file = new Blob([array], {type: 'application/gzip'});
					  }
					  fileDownload(file, "test.zip")
				  })
			  }} style={{ fontWeight: 'bold' }}>
			  	{this.props.html}
			  </div>
			)
		}
		else {
			return <a href={this.props.url} download="recent-file.txt" style={{fontWeight: 'bold'}}>Download File</a>
		}
	}

}