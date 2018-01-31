import React from 'react'
import { distanceInWords } from 'date-fns'
import UploadButton from '../UploadButton'

export default class SubmissionInfo extends React.Component {
  render () {
    const statusStyle = {}
    const uploadedDate = new Date(this.props.uploadedDate)
    const uploadedTime = distanceInWords(new Date(), uploadedDate, {addSuffix: true})

    return (
      <div>
        <h1>Latest Submission:</h1>
        <div style={{ marginLeft: 10 }} >
          <p>
            <span>Uploaded:</span> ({uploadedTime})  {uploadedDate.toDateString() + ' ' +  uploadedDate.toLocaleTimeString('en-US') }
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
