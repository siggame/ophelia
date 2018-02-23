import React from 'react'
import { distanceInWords } from 'date-fns'
import UploadButton from '../UploadButton'
import StatusBadge from './StatusBadge.js'

export default class SubmissionBanner extends React.Component {
  render () {
    const statusStyle = {}
    const uploadedDate = new Date(this.props.uploadedDate)
    const uploadedTime = distanceInWords(new Date(), uploadedDate, {addSuffix: true})

    return (
      <nav className='navbar navbar-inverted submission-banner'>
        <span className='col-md-2'>
          <span className='bolded'>Latest Submission:</span>
        </span>
        <span className='col-md-4'>
          <span className='bolded'>Uploaded: ({uploadedTime})</span>  {uploadedDate.toDateString() + ' ' + uploadedDate.toLocaleTimeString('en-US') }
        </span>
        <span className='col-md-4'>
          <span className='bolded'>Status:</span> <span style={statusStyle} ><StatusBadge status={this.props.status} badgeStyle='status-fill' /></span>
        </span>
        <span className='col-md-2'>
        <div className="form-group">
          <label>Comment:</label>
          <textarea className="form-control" rows="5" id="comment" />
        </div>
          <UploadButton />
        </span>
      </nav>
    )
  }
}

SubmissionBanner.defaultProps = {
  uploadedDate: ''

}
