// Chartcell

// Each Chartcell gets its chart price data from the IEX API and creates the chart display data
// Data provided for free by IEX. View IEX’s Terms of Use.
// See: https://iextrading.com/developer/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { TypeChooser } from 'react-stockcharts/lib/helper'
import CandleStickChartWithMA from '../CandleStickChartWithMA'
// import Chartgraph from '../Chartgraph'
import Charttabs from '../Charttabs'
import './styles.css'

class Chartcell extends Component {
  constructor(props) {
    super(props)
    this.loadChartData = this.loadChartData.bind(this)
    this.state = {
      loadingMsg: 'Loading Chart Please Wait...',
    }
  }

  componentDidMount() {
    this.loadChartData()
  }

  loadChartData = () => {
    this.setState({ ...this.state, loadingMsg: 'Loading Chart Please Wait...' })
    const IEX_BASE = 'https://api.iextrading.com/1.0/'
    const symbol = this.props.cellObject.symbol
    const filter = '?filter=date,open,high,low,close,volume'
    axios
      .get(`${IEX_BASE}stock/${symbol}/chart/1y${filter}`)
      .then((res) => {
        let values = res.data
        let data = values.map((obj) => {
          let date = obj.date
          obj.date = new Date(date)
          return obj
        })
        this.setState({ data })
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
          console.log(`${IEX_BASE}stock/${symbol}/chart/1y`)
          // debugger //testing
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
          debugger //testing
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
          debugger //testing
        }
        console.log(error.config)
        debugger //testing
      })
  }

  buildChartData(response) {
    this.setState({
      ...this.state,
      loadingMsg: null,
    })
  }

  render() {
    const cellObject = this.props.cellObject
    const chart_name = cellObject.symbol
    const cell_id = chart_name.replace(/[\W_]/g, '')
    const chartId = chart_name.replace(/[\W_]/g, '') + 'chart'

    //Local state holds price data (no change until component is mounted again)
    //Locat state holds indicator values (may change in cellObject with new render)
    //Local state holds chart layout data (may be created again if indicators change)

    // const graphData = ChartLineGraphData(props)

    if (!this.state.data) {
      return (
        <div className="chart-cell-wrapper">
          <h4>{this.state.loadingMsg}</h4>
        </div>
      )
    }
    return (
      <div className="chart-cell-wrapper">
        {/* the Chartcell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
        <div id={cell_id} className="chart-cell">
          <div className="chart-title">{chart_name}</div>
          <div className="graph-content">
            {/* Block below replaces Chartgraph <Chartgraph cellObject={cellObject} /> */}
            <div id={chartId} className="graph-container">
              <div className="graph-table">
                <div className="graph-wrapper">
                  <TypeChooser>{(type) => <CandleStickChartWithMA type={type} data={this.state.data} />}</TypeChooser>{' '}
                </div>
              </div>
            </div>
          </div>
          <div className={'tabs-content'}>
            <h3>Mock dashboard Component</h3>
            {/* <Charttabs cellObject={cellObject} /> */}
          </div>
        </div>
      </div>
    )
  }
}

Chartcell.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

export default Chartcell
