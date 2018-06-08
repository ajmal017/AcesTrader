// Chartcell
// See readme.txt for all reference links.

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Chartgraph from '../Chartgraph'
import Charttabs from '../Charttabs'
import './styles.css'

class Chartcell extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // // Each Chartcell gets its chart price data from the IEX API and creates the chart display data
    // let IEX_BASE_URL = 'https://api.iextrading.com/1.0/'
    // axios
    //   // .get(IEX_BASE_URL + 'stock/aapl/batch?types=chart&range=1m&last=10')
    //   .get(IEX_BASE_URL + 'stock/aapl/batch?types=quote,news,chart&range=1m&last=10')
    //   .then((response) => {
    //     this.buildChartData(response) //experimental
    //   })
    //   .catch(function(error) {
    //     if (error.response) {
    //       // The request was made and the server responded with a status code
    //       // that falls out of the range of 2xx
    //       console.log(error.response.data)
    //       console.log(error.response.status)
    //       console.log(error.response.headers)
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //       // http.ClientRequest in node.js
    //       console.log(error.request)
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log('Error', error.message)
    //     }
    //     console.log(error.config)
    //   })
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
                  <h4>Loading Chart Please Wait...</h4>
                  {/* <ReactChartLine data={graphData} /> */}
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
