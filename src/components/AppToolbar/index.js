// AppToolbar/index.js

import React from 'react'
import * as Icons from '../../lib/IconsLookup.js'
import withSizes from 'react-sizes'
import Scrollchor from 'react-scrollchor' //scroll to anchor in page
import Dropdown from 'rc-dropdown'
import Menu, { Item as MenuItem } from 'rc-menu'
import 'rc-dropdown/assets/index.css'
import Charts from '../Charts'
import './styles.css'
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
  const showCharts = true
  const allowMonteCarlo = false

  // Create an array of MenuItems, one for each chart that is drawn,
  // to be placed in a DropDown toolbar button for the chart picker.
  const chartObject = props.chartObject
  let chartkeys = chartObject ? Object.keys(chartObject) : null

  // Button6 and button7 will change their
  // visual style depending on the props provided.
  // We use capitalized names for their calculated styles.
  // Set up the className strings for buttons 6 & 7.
  const ICON6 = `icon6${allowMonteCarlo ? '' : ' disabled'}`
  const LABEL6 = `label6${allowMonteCarlo ? '' : ' disabled'}`
  const ICON7 = `icon7${showCharts ? '' : ' hidden'}`
  const LABEL7 = `label7${showCharts ? '' : ' hidden'}`

  // This overrides the icon's padding in the styles.css
  let divStyleIcon =
    props.width < 700
      ? {
          padding: '0 4px',
        }
      : {
          padding: '0 12px',
        }

  // ****This section below supports the 'rc-dropdown' and 'rc-menu' usage in button7 **
  function onSelect({ key }) {
    // debugger
  }
  function onVisibleChange(visible) {
    props.handleClick(null, 'chartpicker') //alert parent of possible chart hash url
    // debugger
  }

  let menuItems = []
  if (chartkeys) {
    menuItems = chartkeys.map(function(keyvalue, index) {
      // Note: adjust offset value for positioning the scroll target location relative to the Scroll button.
      return (
        <MenuItem key={index.toString()}>
          <Scrollchor to={keyvalue.replace(/[\W_]/g, '')} animate={{ offset: -144, duration: 1000 }} className="nav-link">
            {keyvalue}
          </Scrollchor>
        </MenuItem>
      )
    })
  }
  const menu = <Menu onSelect={onSelect}>{menuItems}</Menu>
  // ****This section above supports the 'rc-dropdown' and 'rc-menu' usage in button7 **

  return (
    <div>
      {/* return the tool bar layout */}
      <div className="grid-container">
        <div className="icon1" style={divStyleIcon}>
          <img id={'newplan'} onClick={handleClick} src={Icons['newplan']} alt="" title={'Start a new MoneyPlan file'} className={'icon-img'} width={38} />
        </div>
        <div className="label1">New</div>

        <div className="icon2" style={divStyleIcon}>
          <img id={'select'} onClick={handleClick} src={Icons['open']} alt="" title={'Pick a MoneyPlan file to select'} className={'icon-img'} width={38} />
        </div>
        <div className="label2">Select</div>

        <div className="icon3" style={divStyleIcon}>
          <img id={'save'} onClick={handleClick} src={Icons['save']} alt="" title={'Save the MoneyPlan file in the device memory'} className={'icon-img'} width={38} />
        </div>
        <div className="label3">Save</div>

        <div className="icon4" style={divStyleIcon}>
          <img id={'planview'} onClick={handleClick} src={Icons['planview']} alt="" title={'Show the MoneyPlan tree view'} className={'icon-img'} width={38} />
        </div>
        <div className="label4">Plan</div>

        <div className="icon5" style={divStyleIcon}>
          <img id={'charts'} onClick={handleClick} src={Icons['charts']} alt="" title={'Calculate the MoneyPlan charts and tables'} className={'icon-img'} width={38} />
        </div>
        <div className="label5">Charts</div>

        <div className={ICON6} style={divStyleIcon}>
          <img
            id={'montecarlo'}
            onClick={handleClick}
            src={Icons['montecarlo']}
            alt=""
            title={'Run a Monte Carlo simulation using the MoneyPlan data and calculation results'}
            className={'icon-img'}
            width={38}
          />
        </div>
        <div className={LABEL6}>Monte Carlo</div>

        <div className={ICON7} style={divStyleIcon}>
          <Dropdown
            trigger={['click']}
            overlay={menu}
            // animation="slide-up"
            onVisibleChange={onVisibleChange}>
            <img id={'chartpicker'} onClick={handleClick} src={Icons['chartpicker']} alt="" title={'Scroll a selected chart into view'} className={'icon-img'} width={38} />
          </Dropdown>
        </div>
        <div className={LABEL7}>Chart Picker</div>
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
