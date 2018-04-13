import { inject, observer } from 'mobx-react'
import React from 'react'
import { LoadingOverlay, Loader } from 'react-overlay-loader'

import Submissions from '../components/Submissions'

import 'react-overlay-loader/styles.css'

@inject('submissionStore')
@observer
export default class SubmissionListContainer extends React.Component {
  render () {
    return (
      <LoadingOverlay>
        <Submissions />
        <Loader loading={this.props.submissionStore.isLoading} />
      </LoadingOverlay>
    )
  }
}