// AppView

import React from 'react'
import PropTypes from 'prop-types'
import AppToolbar from './AppToolbar'
// import planToolbar from './planToolbar.js'
import Plan from '../Plan'
import Charts from '../Charts'
// import { objectQuery } from '../../lib/navigateBreadCrumbs'
import './styles.css'

const AppView = (props) => {
  'use-strict'
  const dataStore = props.dataStore
  const planName = dataStore.planName
  const planJson = dataStore.planJson //used by Charts to test for new plan (may not be needed with Redux)
  const allowMonteCarlo = dataStore.montecarloAllowed === true //set when Chart calculations are error free
  const showCharts = dataStore.showCharts //switch set by user's toolbar click on Charts icon
  const chartObject = dataStore.chartObject
  const handleClick = props.handleClick //passed on down to Plan to signal back to Forecaster

  // Create an array of MenuItems, one for each chart that is drawn,
  // to be placed in a DropDown toolbar button for the chart picker.
  let chartkeys = chartObject ? Object.keys(chartObject) : null

  return (
    <div>
      <div id="appplanname">
        Plan Name:<span className="toolbar-planname">
          {' '}
          {planName} {props.dirty ? '*' : null}
        </span>
      </div>
      <div id="appicontoolbar">
        <AppToolbar handleClick={handleClick} showCharts={showCharts} allowMonteCarlo={allowMonteCarlo} chartkeys={chartkeys} />
      </div>
      {/* Render either Charts or Plan */}
      {chartObject && showCharts ? <Charts chartObject={chartObject} planJson={planJson} /> : <Plan dataStore={dataStore} handleClick={handleClick} />}
    </div>
  )
}

AppView.propTypes = {
  dirty: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  dataStore: PropTypes.object.isRequired,
}

export default AppView
