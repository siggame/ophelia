import { inject } from 'mobx-react'
import React from 'react'
import { Uploader, UploadField } from '@navjobs/upload'

@inject('authStore')
export default class UploadButton extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      file: null
    }

    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile () {
    return
  }

  render () {
    // TODO: Handle when uploads are complete
    return (
      <Uploader
        request={{
          fileName: 'file',
          headers: {
            Authorization: `Bearer ${this.props.authStore.token}`
          },
          url: '/submissions/',
          method: 'POST'
        }}
        onComplete={() => console.log('yay!')}
        uploadOnSelection
      >
        {({ onFiles, progress, complete }) => (
          <div>
            <UploadField
              onFiles={onFiles}
              uploadProps={{
                accept: '.zip,.tar,.tar.gz'
              }}
            >
              <div className='btn btn-primary'>Upload AI (.zip, .tar, .tar.gz)</div>
            </UploadField>
            {progress ? `Progress: ${progress}` : null}
            {complete ? 'Complete!' : null}
          </div>
        )}
      </Uploader>
    )
  }
}
