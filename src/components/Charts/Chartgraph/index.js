// Chartgraph
// See readme.txt for all reference links.

// Note: Chart data is returned from the RetirementForecaster engine as a JSON object of calculated results.
// This object is the props data.

import React from 'react'
import PropTypes from 'prop-types'
import ReactChartLine from '../ReactChartLine'
import ChartLineGraphData from '../ChartLineGraphData'
import './styles.css'

const Chartgraph = (props) => {
  'use-strict'
  // eslint-disable-next-line
  const { chart_name, data_object } = props // the calculation result's data
  let chartId = chart_name.replace(/[\W_]/g, '') + 'chart'

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
  chart_name: PropTypes.string.isRequired,
  data_object: PropTypes.object.isRequired,
}

export default Chartgraph
