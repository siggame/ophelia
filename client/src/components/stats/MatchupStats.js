import { inject, observer } from 'mobx-react'
import React from 'react'
import RegisterView from '../Register'
import {curveCatmullRom} from 'd3-shape';

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  HorizontalBarSeries,
} from 'react-vis'



@inject('submissionStore')
@observer
export default class Stats extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stats: [],
      value: false
    }
  }

  render () {
    const winingColor = 'green'
    const losingColor = '#c10303'
    const data = []
    for (const stat of this.props.stats) {
      const value = stat.stats.wins - stat.stats.losses
      data.push({
        y: String(stat.name),
        x: value,
        color: value < 0 ? losingColor : winingColor
      })
      data.push({
        y: String(stat.name + '0'),
        x: value,
        color: value < 0 ? losingColor : winingColor
      })
      data.push({
        y: String(stat.name + '1'),
        x: value,
        color: value < 0 ? losingColor : winingColor
      })
      data.push({
        y: String(stat.name + '2'),
        x: value,
        color: value < 0 ? losingColor : winingColor
      })
    }
    console.log(data)

    return (
      <div>
        <XYPlot
        yType="ordinal"
        width={300}
        height={100 * data.length}
        yDistance={100}
        >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <HorizontalBarSeries
        width={300}
        className="vertical-bar-series-example"
        data={data}/>
        </XYPlot>
      </div>
    )
  }
}

Stats.defaultProps = {
  stats: []
}
