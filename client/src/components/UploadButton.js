import React from 'react'
import { Uploader, UploadField } from '@navjobs/upload'

export default class UploadButton extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      file: null
    }

    this.uploadFile = this.uploadFile.bind(this)
  }

  render () {
    // TODO: Handle when uploads are complete
    return (
      <Uploader
        request={{
          fileName: 'file',
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
                accept: '.zip'
              }}
            >
              <div className='btn btn-primary'>Upload AI (.zip)</div>
            </UploadField>
            {progress ? `Progress: ${progress}` : null}
            {complete ? 'Complete!' : null}
          </div>
        )}
      </Uploader>
    )
  }
}
