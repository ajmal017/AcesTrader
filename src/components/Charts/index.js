// Charts/index.js
// This is the container for the nested Charts components

import React from 'react'
import PropTypes from 'prop-types'
import ChartsView from './ChartsView'
import './styles.css'

// // this is to get some chart data for this mocked display until we get real data from IEX
// import examplechartdata from './examplechartdata'

const Charts = (props) => {
  'use-strict'

  if (props.chartArray.length > 0) {
    return (
      <div id={'chartscontianer'}>
        <ChartsView handleClick={props.handleClick} chartArray={props.chartArray} />
      </div>
    )
  } else {
    return <h3 className="error"> There are no symbols in this list</h3>
  }
}

Charts.propTypes = {
  chartArray: PropTypes.array.isRequired,
}

export default Charts
