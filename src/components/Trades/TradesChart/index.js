// TradesChart/index.js

import React from 'react'
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
// import './styles.css'

const data = [
  { symbol: 'AMZN', GainPercentage: 8.4 },
  { symbol: 'MSFT', GainPercentage: 13.98 },
  { symbol: 'ALFA', GainPercentage: -9.8 },
  { symbol: 'VTI', GainPercentage: 3.908 },
  { symbol: 'VTC', GainPercentage: 4.8 },
  { symbol: 'VNQI', GainPercentage: -3.8 },
  { symbol: 'VWO', GainPercentage: 4.3 },

  { symbol: 'AMZN', GainPercentage: 4.0 },
  { symbol: 'MSFT', GainPercentage: -3.0 },
  { symbol: 'ALFA', GainPercentage: -2.0 },
  { symbol: 'VTI', GainPercentage: 2.78 },
  { symbol: 'VTC', GainPercentage: -18.9 },
  { symbol: 'VNQI', GainPercentage: 2.39 },
  { symbol: 'VWO', GainPercentage: 3.49 },
]
class TradesChart extends React.Component {
  render() {
    return (
      <div id='tradeschartcontainer'>
        <BarChart width={500} height={200} data={data} margin={{ top: 35, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='symbol' />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          {/* <Bar dataKey='pv' fill='#8884d8' /> */}
          <Bar dataKey='GainPercentage' fill='#82ca9d' />
        </BarChart>
      </div>
    )
  }
}
export default TradesChart
