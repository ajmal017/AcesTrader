// AppToolbar/index.js

import React, { Component } from 'react'
import withSizes from 'react-sizes'
import Scrollchor from 'react-scrollchor' //scroll to anchor in page
import Charts from '../Charts' //replace cash flow with stock prices and trader's control panel
import './styles.css'

const AppToolbar = function(props) {
  'use-strict'

  // Create an array of keys, one for each chart that is drawn,
  // to be placed in a toolbar button for the chart picker.
  const chartObject = props.chartObject
  let chartkeys = chartObject ? Object.keys(chartObject) : null

  let menuItems = []
  if (chartkeys) {
    menuItems = chartkeys.map(function(keyvalue, index) {
      return (
        <a key={index.toString()}>
          <Scrollchor to={keyvalue.replace(/[\W_]/g, '')} disableHistory={true} animate={{ offset: -110, duration: 500 }} className="nav-link">
            {keyvalue}
          </Scrollchor>
        </a>
      )
    })
  }

  return (
    <div>
      <div className="scrollmenucontainer">
        <div className="scrollmenu">{menuItems}</div>
      </div>
      <Charts chartObject={chartObject} handleClick={props.handleClick} />
    </div>
  )
}

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item to FilePanel
// https://www.npmjs.com/package/react-sizes
export default withSizes(mapSizesToProps)(AppToolbar)
