// TradesChart/index.js

import React from 'react'
import PropTypes from 'prop-types'
import withSizes from 'react-sizes'
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

// const data = [
//   { symbol: 'AMZN', Gain: 8.4 },
//   { symbol: 'MSFT', Gain: 13.98 },
//   { symbol: 'ALFA', Gain: -9.8 },
//   { symbol: 'VTI', Gain: 3.908 },
//   { symbol: 'VTC', Gain: 4.8 },
//   { symbol: 'VNQI', Gain: -3.8 },
//   { symbol: 'VWO', Gain: 4.3 },

//   { symbol: 'AMZN', Gain: 4.0 },
//   { symbol: 'MSFT', Gain: -3.0 },
//   { symbol: 'ALFA', Gain: -2.0 },
//   { symbol: 'VTI', Gain: 2.78 },
//   { symbol: 'VTC', Gain: -18.9 },
//   { symbol: 'VNQI', Gain: 2.39 },
//   { symbol: 'VWO', Gain: 3.49 },

//   { symbol: 'AMZN', Gain: 8.4 },
//   { symbol: 'MSFT', Gain: 13.98 },
//   { symbol: 'ALFA', Gain: -9.8 },
//   { symbol: 'VTI', Gain: 3.908 },
//   { symbol: 'VTC', Gain: 4.8 },
//   { symbol: 'VNQI', Gain: -3.8 },
//   { symbol: 'VWO', Gain: 4.3 },

// { symbol: 'AMZN', Gain: 4.0 },
// { symbol: 'MSFT', Gain: -3.0 },
// { symbol: 'ALFA', Gain: -2.0 },
// { symbol: 'VTI', Gain: 2.78 },
// { symbol: 'VTC', Gain: -18.9 },
// { symbol: 'VNQI', Gain: 2.39 },
// { symbol: 'VWO', Gain: 3.49 },
// ]

class TradesChart extends React.Component {
  render() {
    let data1 = this.props.tradesArray.map((tradeObject) => {
      const tradeSide = tradeObject.dashboard.tradeSide
      const enteredPrice = tradeObject.enteredPrice
      const exitedPrice = tradeObject.exitedPrice
      const tradePercentGainTemp = ((100 * (exitedPrice - enteredPrice)) / enteredPrice).toFixed(1)
      const tradePercentGain = tradeSide === 'Shorts' ? -tradePercentGainTemp : tradePercentGainTemp
      return { symbol: tradeObject.symbol, Gain: tradePercentGain, fillColor: '#00ca9d' }
    })
    const data = data1.reverse()

    return (
      <div id='tradeschartcontainer'>
        <BarChart width={this.props.width - 40} height={200} data={data} margin={{ top: 35, right: 30, left: 20, bottom: 15 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='symbol' tick={{ value: 'symbol', angle: -90, textAnchor: 'end' }} />
          <YAxis label={{ value: 'Gain %', angle: -90, position: 'outsideLeft' }} /> {/* <Tooltip /> */}
          <Tooltip />
          {/* <Legend /> */}
          <ReferenceLine y={0} stroke='#000' />
          {/* <Bar dataKey='Gain' fill='fillColor' minPointSize={3} /> */}
          {/* <Bar dataKey='Gain' fill={{ value: '#ff0000' }} minPointSize={3} /> */}
          <Bar dataKey='Gain' fill='#91a7ff' minPointSize={3} />
        </BarChart>
      </div>
    )
  }
}

// This array is a list of trade results
TradesChart.propTypes = {
  tradesArray: PropTypes.array.isRequired,
}

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item to FilePanel
// https://www.npmjs.com/package/react-sizes
export default withSizes(mapSizesToProps)(TradesChart)
