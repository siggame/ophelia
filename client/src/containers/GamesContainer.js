import { inject, observer } from 'mobx-react'
import React from 'react'
import { LoadingOverlay, Loader } from 'react-overlay-loader'

import Games from '../components/dashboard/Games'

import 'react-overlay-loader/styles.css'

@inject('gameStore')
@observer
export default class GamesContainer extends React.Component {
  render () {
    return (
      <LoadingOverlay>
        <Games />
        <Loader loading={this.props.gameStore.isLoading} />
      </LoadingOverlay>
    )
  }
}