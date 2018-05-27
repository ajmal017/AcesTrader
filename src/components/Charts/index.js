// Charts
// This is the container for the nested Charts components

import React from 'react'
import PropTypes from 'prop-types'
import ChartsView from './ChartsView'

const Charts = (props) => {
  'use-strict'
  return (
    <ChartsView chartObject={props.chartObject} planJson={props.planJson} />
  )
}

Charts.propTypes = {
  chartObject: PropTypes.object.isRequired,
  planJson: PropTypes.string,
}

export default Charts
