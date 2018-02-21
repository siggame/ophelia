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
      'application/x-tar'
    ]
    if (file) {
      if (acceptedFiletypes.includes(file.type)) {
        this.props.submissionStore.uploadSubmission(file)
      } else {
        this.props.submissionStore.uploadError = 'Incorrect filetype - file must be .zip, .tar or .tar.gz.'
      }
    }
  }

  render () {
    return (
      <div className='col-sm-4'>
        <UploadField
          onFiles={files => this.uploadFile(files[0])}
          uploadProps={{
            accept: '.zip,.tar,.tar.gz'
          }}
        >
          <div style={{ width: '100%' }} className='btn btn-primary'>
            Upload AI
          </div>
        </UploadField>
      </div>
    )
  }
}
