// Charts
// This is the container for the nested Charts components

import React from 'react'
import PropTypes from 'prop-types'
import ChartsView from './ChartsView'

// this is to get one chart's data for this display
import examplechartdata from './examplechartdata'

const Charts = (props) => {
  'use-strict'

  // Get an example chart data from a multidata json file
  let chartObject
  const planNameLowerCase = 'saving then retirement'
  const newLocal = examplechartdata[0]
  let newLocalKeys = Object.keys(newLocal) //keys of child objects
  newLocalKeys.map((key, index) => {
    if (planNameLowerCase === key) {
      chartObject = newLocal[key].content
    }
    return null
  })

  return (
    <div id={'chartscontianer'}>
      <ChartsView chartObject={chartObject} />
    </div>
  )
}

Charts.propTypes = {
  chartListObject: PropTypes.object.isRequired,
}

export default Charts
