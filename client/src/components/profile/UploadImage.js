import React from 'react'
import PropTypes from 'prop-types'
import { UploadField } from '@navjobs/upload'

// TODO: Upload image to API
export default class UploadImage extends React.Component {
  handleFileChange = image => {
    const reader = new FileReader()
    reader.onloadend = () => {
      this.props.onChange(this.props.name, reader.result)
    }

    if (image) {
      reader.readAsDataURL(image)
    }
  }

  render () {
    return (
      <UploadField
        onFiles={files => this.handleFileChange(files[0])}
        uploadProps={{
          accept: '.png,.jpg,.gif'
        }}
      >
        <div style={{ width: '100%' }} className='btn btn-primary'>
          Upload Profile Image
        </div>
      </UploadField>
    )
  }
}

UploadImage.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}
