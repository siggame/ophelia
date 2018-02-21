import { inject, observer } from 'mobx-react'
import React from 'react'
import { LoadingOverlay, Loader } from 'react-overlay-loader'

import SubmissionInfo from '../components/dashboard/SubmissionInfo'

import 'react-overlay-loader/styles.css'

@inject('submissionStore')
@observer
export default class SubmissionContainer extends React.Component {
  render () {
    return (
      <LoadingOverlay>
        <SubmissionInfo />
        <Loader loading={this.props.submissionStore.isLoading} />
      </LoadingOverlay>
    )
  }
}