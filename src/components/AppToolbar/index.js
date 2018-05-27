// AppToolbar/index.js

import React from 'react'
import * as Icons from '../../lib/IconsLookup.js'
import withSizes from 'react-sizes'
import Scrollchor from 'react-scrollchor' //scroll to anchor in page
import Dropdown from 'rc-dropdown'
import Menu, { Item as MenuItem } from 'rc-menu'
import 'rc-dropdown/assets/index.css'
import Charts from '../Charts' //for dummy layout
import './styles.css'
import { Button } from 'react-bootstrap'
// ****See: https://github.com/react-component/dropdown **
// ****See: https://github.com/react-component/menu **

const AppToolbar = function(props) {
  'use-strict'

  const handleClick = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    const flag = evt.target.id
    props.handleClick(evt, flag)
  }

  // Create an array of keys, one for each chart that is drawn,
  // to be placed in a toolbar button for the chart picker.
  const chartObject = props.chartObject
  let chartkeys = chartObject ? Object.keys(chartObject) : null

  function onVisibleChange(visible) {
    props.handleClick(null, 'chartpicker') //alert parent of possible chart hash url
    // debugger
  }

  let menuItems = []
  if (chartkeys) {
    menuItems = chartkeys.map(function(keyvalue, index) {
      return (
        <a key={index.toString()}>
          <Scrollchor to={keyvalue.replace(/[\W_]/g, '')} animate={{ offset: -110 }} className="nav-link">
            {/* <Scrollchor to={keyvalue.replace(/[\W_]/g, '')} animate={{ offset: -110, duration: 500 }} className="nav-link"> */}
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
      <Charts chartObject={chartObject} />
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
