import { inject, observer } from 'mobx-react'
import React from 'react'

import {
  RadialChart,
  Hint
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
      const {value} = this.state
      const winingColor = 'green'
      const losingColor = '#c10303'
      const data = [
        {
          angle: this.props.stats.wins,
          color: winingColor
        },
        {
          angle: this.props.stats.losses,
          color: losingColor
        }
      ]
      const winStats = {
        Wins: this.props.stats.wins,
        'Win Percentage': String(Math.round(this.props.stats.winRatio * 100 * 100) / 100) + '%'
      }
      const lossStats = {
        Losses: this.props.stats.wins,
        'Loss Percentage': String(Math.round((1 - this.props.stats.winRatio) * 100 * 100) / 100) + '%'
      }
    console.log(data)

    return (
      <div>
        <RadialChart
          colorType={'literal'}
          colorDomain={[0, 100]}
          colorRange={[0, 10]}
          innerRadius={100}
          radius={140}
          margin={{top: 100}}
          getLabel={d => d.name}
          onValueMouseOver={v => this.setState({
            value: v.color === winingColor ? winStats : lossStats
          })}
          onSeriesMouseOut={v => this.setState({value: false})}
          data={data}
          labelsRadiusMultiplier={1.1}
          labelsStyle={{fontSize: 16, fill: '#222'}}
          showLabels
          style={{stroke: '#fff', strokeWidth: 2}}
          width={400}
          height={300} >
          {value && <Hint value={value}/>}
        </RadialChart>
      </div>
    )
  }
}

Stats.defaultProps = {
  stats: []
}
