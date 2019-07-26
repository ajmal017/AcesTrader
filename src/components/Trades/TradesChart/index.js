// TradesChart/index.js

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import withSizes from 'react-sizes'
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
var cloneDeep = require('lodash.clonedeep')

// const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
// const getPath = (x, y, width, height) => `M${x},${y + height}
//           C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
//           C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
//           Z`;
// const TriangleBar = (props) => {
//   const {
//     fill, x, y, width, height,
//   } = props;
//   return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
//   // return <path d={getPath(x, y, width, height)} stroke="none" fill={'#00ca9d'} />;
// };
// TriangleBar.propTypes = {
//   fill: PropTypes.string,
//   x: PropTypes.number,
//   y: PropTypes.number,
//   width: PropTypes.number,
//   height: PropTypes.number,
// };

const showDollarGain = false // set to false for PercentGain

const chartBarArray = (objectArray) => {
  let barData = objectArray.map((obj) => {
    const listGroup = obj.listGroup
    const tradeSide = obj.dashboard.tradeSide
    const filledQuantity = obj.filledQuantity
    const enteredPrice = obj.enteredPrice
    const exitedPrice = obj.exitedPrice //only defined for closed trades
    const peekPrice = obj.peekPrice //for use with open trades
    const tradePrice = exitedPrice === undefined ? peekPrice : exitedPrice
    const tradeDollarGainTemp = (filledQuantity * (tradePrice - enteredPrice)).toFixed(0)
    const tradeDollarGain = tradeSide === 'Shorts' ? -tradeDollarGainTemp : tradeDollarGainTemp
    const tradePercentGainTemp = ((100 * (tradePrice - enteredPrice)) / enteredPrice).toFixed(1)
    const tradePercentGain = tradeSide === 'Shorts' ? -tradePercentGainTemp : tradePercentGainTemp
    return { symbol: obj.symbol, Gain: showDollarGain ? tradeDollarGain : tradePercentGain, exitedPrice: exitedPrice, listGroup: listGroup, tradeSide: tradeSide }
  })
  return barData
}

const chartBarColor = (element) => {
  const closedTradeColors = ["#ffd43b", "#fab005", "#f08c00"] //yellow
  const openTradeColors = ["#69db7c", "#40c057", "#2f9e44"] //green
  let barColor
  if (element.exitedPrice === undefined) {
    barColor = openTradeColors // open trades
  } else {
    barColor = closedTradeColors // closed trades
  }
  if (element.tradeSide === 'Shorts') return barColor[0]
  if (element.tradeSide === 'Longs') return barColor[1]
  if (element.tradeSide === 'Trend Longs') return barColor[2]
}


class TradesChart extends React.Component {

  render() {

    // data for closed positions
    const data1 = chartBarArray(this.props.tradesArray)
    const dataClosed = data1.reverse()

    // data for the open positions
    const dataLongs = chartBarArray(this.props.state.longs)
    const dataShorts = chartBarArray(this.props.state.shorts)
    const dataTrendlongs = chartBarArray(this.props.state.trendlongs)

    // const shortsSymbols = state.shorts.map((obj) => obj.symbol)
    // const trendlongsSymbols = state.trendlongs.map((obj) => obj.symbol)
    // const symbols = [...buysSymbols, ...sellsSymbols, ...longsSymbols, ...shortsSymbols, ...trendbuysSymbols, ...trendlongsSymbols]

    const data = [...dataClosed, ...dataLongs, ...dataShorts, ...dataTrendlongs]

    const YAxisLabel = showDollarGain ? 'Gain $' : 'Gain %'
    const chartWidth = this.props.width - 40

    return (
      <>
        <div id='tradeschartbutons'></div>
        <div id='tradeschartcontainer'>
          <BarChart width={chartWidth} height={200} data={data} margin={{ top: 0, right: 15, left: 15, bottom: 20 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='symbol' tick={{ value: 'symbol', angle: -90, textAnchor: 'end' }} />
            <YAxis label={{ value: YAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            {/* <Legend /> */}
            <ReferenceLine y={0} stroke='#000' />
            <Bar dataKey='Gain' minPointSize={3} >
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartBarColor(entry)} minPointSize={3} />
                ))}
            </Bar>
          </BarChart>
        </div >
      </>
    )
  }
}

// This array is a list of trade results
TradesChart.propTypes = {
  tradesArray: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  state: state,
})

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item
// https://www.npmjs.com/package/react-sizes
export default connect(mapStateToProps)(withSizes(mapSizesToProps)(TradesChart))
