import { inject, observer } from 'mobx-react'
import React from 'react'
import { LoadingOverlay, Loader } from 'react-overlay-loader'

import SubmissionList from '../components/SubmissionList'

import 'react-overlay-loader/styles.css'

@inject('submissionStore')
@observer
export default class SubmissionListContainer extends React.Component {
  render () {
    return (
      <LoadingOverlay>
        <SubmissionList />
        <Loader loading={this.props.submissionStore.isLoading} />
      </LoadingOverlay>
    )
  }
}