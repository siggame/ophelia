import { inject } from 'mobx-react'
import React from 'react'
import { UploadField } from '@navjobs/upload'

@inject('submissionStore')
export default class UploadButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null
    }
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile (file) {
    const acceptedFiletypes = [
      'application/zip',
      'application/gzip',
      'application/x-tar',
      'application/x-zip-compressed'
    ]
    if (file) {
      if (acceptedFiletypes.includes(file.type)) {
        if (this.props.data && this.props.data.hasOwnProperty('lang')) {
          // Set the language in localStorage, so that it can get loaded automatically.
          localStorage.setItem('lang', this.props.data.lang)
          this.props.submissionStore.uploadSubmission(file, this.props.data.lang)  
        } else {
          this.props.submissionStore.uploadSubmission(file, null)
        }
      } else {
        this.props.submissionStore.uploadError = 'Incorrect filetype - file must be .zip, .tar or .tar.gz.'
      }
    }
  }

  render () {
    return (
      <span>
        {/* <UploadField
          onFiles={files => this.uploadFile(files[0])}
          uploadProps={{
            accept: '.zip,.tar,.tar.gz'
          }}
        >
          <div style={this.props.style} className='btn btn-primary custom-upload-button'>
            Upload AI
          </div>
        </UploadField> */}
        <h4>Submissions have been closed!</h4>
      </span>
    )
  }
}
