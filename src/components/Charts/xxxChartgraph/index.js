// Chartgraph/index.js

import React from 'react'
import PropTypes from 'prop-types'
import ReactChartLine from '../ReactChartLine'
import ChartLineGraphData from '../ChartLineGraphData'
import './styles.css'

const Chartgraph = (props) => {
  'use-strict'
  // eslint-disable-next-line
  const cellObject = props.cellObject
  const chart_name = cellObject.symbol
  const chartId = cellObject.symbol.replace(/[\W_]/g, '') + 'chart'

  // Pass the props to the data refactor method,
  // returns the data formated for the chart.js line chart.

  const data = ChartLineGraphData(props)

  return (
    <div id={chartId} className="graph-container">
      <div className="graph-table">
        <div className="graph-wrapper">
          <ReactChartLine data={data} />
        </div>
      </div>
    </div>
  )
}

Chartgraph.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

export default Chartgraph
