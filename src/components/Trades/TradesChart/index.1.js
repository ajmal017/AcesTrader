// TradesChart/index1.js

import React from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPortal, VictoryLabel } from 'victory'

// const data2012 = [{ gain: 13, label: 'MSFT' }, { gain: 5, label: 'AMZN' }, { gain: -4, label: 'APPL' }, { gain: 8, label: 'ALFA' }]
const data2012 = [{ symbol: 1, gain: 13, label: 'MSFT' }, { symbol: 2, gain: 5, label: 'AMZN' }, { symbol: 3, gain: -4, label: 'APPL' }, { symbol: 4, gain: 8, label: 'ALFA' }]
// const data2012 = [{ sy: 1, gain: 13, label: 'MSFT' }, { sy: 2, gain: 5, label: 'AMZN' }, { sy: 3, gain: -4, label: 'APPL' }, { sy: 4, gain: 8, label: 'ALFA' }]

class TradesChart extends React.Component {
  render() {
    return (
      <div>
        <h1>Trade Results</h1>
        <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
          {/* <VictoryAxis tickValues={['MSFT', 'AMZN', 'APPL', 'ALFA']} /> */}
          {/* <VictoryAxis tickValues={[]} /> */}
          <VictoryAxis dependentAxis tickFormat={(y) => `${y}%`} />
          <VictoryBar data={data2012} x={'symbol'} y={'gain'} />
        </VictoryChart>
      </div>
    )
  }
}
export default TradesChart
