import { inject, observer } from 'mobx-react'
import React from 'react'
import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import ReactFC from 'react-fusioncharts'
import RegisterView from '../Register'

Charts(FusionCharts)

@inject('submissionStore')
@observer
export default class Stats extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stats: []
    }
  }

    render () {
    const data = []
    for (const stat of this.props.stats) {
      data.push({
        label: stat.name,
        value: stat.stats.wins - stat.stats.losses
      })
    }
    console.log(data)

    const myDataSource = {
      chart: {
        caption: 'Wins/Losses',
      },
      data: data
    };


    const chartConfigs = {
      type: 'column2d',
      width: 600,
      height: 400,
      dataFormat: 'json',
      dataSource: myDataSource,
    }
    return (
      <div>
        <ReactFC {...chartConfigs}/>
      </div>
    )
  }
}

Stats.defaultProps = {
  stats: []
}
