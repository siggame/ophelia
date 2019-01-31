import { distanceInWords } from 'date-fns'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { Alert } from 'react-bootstrap'
import DownloadButton from '../DownloadButton'
import axios from 'axios'
import UploadButton from '../UploadButton'
import ButtonRefresh from '../ButtonRefresh'
import { langs } from '../../vars'
import DownloadData from '../DownloadData';

const isBinaryFile = require('isbinaryfile')

// TODO: There might be an argument for not having this here - but I'm just not sure. Should do some research into that. - RD
const langOptions = langs.map(data => <option key={data.slug} value={data.slug}>{data.name}</option>)

@inject('submissionStore')
@observer
export default class SubmissionInfo extends React.Component {
  constructor (props) {
    super(props)
    const previousLang = localStorage.getItem('lang')
    const newLang = previousLang ? previousLang : ''
    this.state = {
      lang: newLang
    }

    this.handleLangChange = this.handleLangChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.getFile = this.getFile.bind(this)
  }

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

  handleLangChange (event) {
    this.setState({ lang: event.target.value })
  }

  handleClick(version) {
    this.getFile(version)
  }

  render () {
    const statusStyle = {}
    let uploadError
    if (this.props.submissionStore.uploadError) {
      uploadError = (
        <Alert bsStyle='danger' onDismiss={() => { this.props.submissionStore.uploadError = '' }}>
          <p>{this.props.submissionStore.uploadError}</p>
        </Alert>
      )
    }

    const uploadForm = (
      <form className='row'>
        <select className='form-control col-xs-6' value={this.state.lang} onChange={this.handleLangChange} style={{ width:'auto', marginRight:'10%', marginLeft: 15 }}>
          <option value='' disabled='disabled'>Submission Language</option>
          {langOptions}
        </select>
        <UploadButton className='col-xs-6' data={{ lang:this.state.lang }} style={{ width:'45%'}} />
      </form>
    )

    if (!this.props.submissionStore.submissions.length) {
      return (
        <div>
          <div className='row'>
            <div className='col-xs-10'>
              <h2 style={{ fontWeight:'bold' }}>Latest Submission</h2>
            </div>
            <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}>
              <ButtonRefresh buttonOnClick={this.props.submissionStore.makeDataStale} />
            </div>
          </div>
          <div style={{ marginLeft: 10 }}>
            {uploadError}
            <h4 style={{ marginBottom: 20 }}>
              You haven't uploaded any code. Select your language and upload your AI below.
            </h4>
            {uploadForm}
          </div>
        </div>
      )
    }

    let latestSubmission = this.props.submissionStore.submissions[0]
    const uploadedDate = new Date(latestSubmission.createdAt)
    const uploadedTime = distanceInWords(new Date(), uploadedDate, {addSuffix: true})
    // TODO: Making this disabled w/ an anchor still allows users w/ assitive tech to click the link.
    // This would be best solved by using a Button element w/ the disabled class.
    let logUrl = (
      <a className='disabled btn btn-info btn-sm' tabIndex={0} style={{ fontWeight: 'bold' }}>
        Build Log
      </a>
    )
    let zipButton = (
      <a className='disabled btn btn-info btn-sm' tabIndex={0} style={{ fontWeight: 'bold' }}>Download File</a>
    )
    if (latestSubmission.version !== null) {
      // Call latestSubmission.version to get the correct version number
      // On click call a get request to get the file
      logUrl = (
        <DownloadButton url={latestSubmission.logUrl}
        html={(<a className='btn btn-info btn-sm' style={{ fontWeight: 'bold' }}>
          Build Log
        </a>)}/>
      )
      zipButton = (
        <DownloadData version={latestSubmission.version}
        html={(<a className='btn btn-info btn-sm' style={{ fontweight: 'bold'}}>
          Download File
        </a>)}/>
      )

    }

    return (
      <div>
        <div className='row'>
          <div className='col-xs-10'>
            <h2 style={{ fontWeight:'bold' }}>Latest Submission</h2>
          </div>
          <div className='col-xs-2' style={{padding: '3vh 0 4px 0'}}>
            <ButtonRefresh buttonOnClick={this.props.submissionStore.makeDataStale} />
          </div>
        </div>

        <div style={{ marginLeft: 10 }} className='row' >
          {uploadError}
          <div style={{ marginBottom: 15 }}>
            <span>Uploaded:</span> {uploadedDate.toDateString() + ' ' +  uploadedDate.toLocaleTimeString('en-US') } ({uploadedTime})
          </div>
          <div className='row' style={{ padding: '10px 0 10px 0' }}>

            <div className='col-md-4'>
              {logUrl}
            </div>
            <div className='col-md-4'>
              {zipButton}
            </div>
            <div className='col-md-4 text-center'><span style={{ fontWeight: 'bold' }}>Version:</span> {latestSubmission.version}</div>
          </div>
          <p>
            <span style={{ fontWeight: 'bold' }}>Status:</span> <span style={statusStyle} >{latestSubmission.status}</span>
          </p>
        </div>
        <div style={{ marginLeft: 10 }} className='row'>
          {uploadForm}
        </div>

      </div>
    )
  }
}
