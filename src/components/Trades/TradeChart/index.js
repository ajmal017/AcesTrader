//TradeChart/index.js

import React from 'react'
import PropTypes from 'prop-types'
// import { render } from 'react-dom'
import Chart from './Chart'
import { getData } from './utils'

import { TypeChooser } from 'react-stockcharts/lib/helper'

class TradeChart extends React.Component {
  componentDidMount() {
    getData().then((data) => {
      this.setState({ data })
    })
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>
    }
    // return <TypeChooser>{(type) => <Chart type={type} data={this.state.data} />}</TypeChooser>
    return <Chart height={200} type={'svg'} data={this.state.data} />
  }
}

TradeChart.propTypes = {
  resultsData: PropTypes.object.isRequired,
}

export default TradeChart

// render(
// 	<ChartComponent />,
// 	document.getElementById("root")
// );
