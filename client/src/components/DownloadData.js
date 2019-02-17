import React from 'react'
import axios from 'axios'
const isBinaryFile = require('isbinaryfile')
const fileDownload = require('js-file-download')

export default class DownloadData extends React.Component {
	getFile(version) {
		var url = process.env.REACT_APP_API_URL + '/submissions/' + version;
		axios({
			method:'get',
			url: url,
			responseType: 'arraybuffer'
		}).then(function (response) {
			var blob = new Blob([response.data], {type: "application/zip"});
			fileDownload(blob, "version_" + version + ".zip");
		})
	}

	render() {
		if (this.props.version) {
			return (
			  <div onClick={() => {
				  this.getFile(this.props.version)
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