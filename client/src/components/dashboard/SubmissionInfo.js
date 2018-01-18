import React from 'react'
import UploadButton from '../UploadButton'

export default class SubmissionInfo extends React.Component {
  render () {
    const statusStyle = {}
    const uploadedTime = ''
    const uploadedDate = this.props.uploadedDate

    return (
      <div>
        <h1>Latest Submission:</h1>
        <div style={{ marginLeft: 10 }} >
          <p>
            <span>Uploaded:</span> ({uploadedTime}) {uploadedDate}
          </p>
          <p>
            Status: <span style={statusStyle} >{this.props.status}</span>
          </p>
          <UploadButton />
        </div>
      </div>
    )
  }
}

SubmissionInfo.defaultProps = {
  uploadedDate: '',

}