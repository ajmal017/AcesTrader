// AppToolbar/index.js

import React, { Component } from 'react'
import Link from 'react-router-hash-link'
import withSizes from 'react-sizes'
import Scrollchor from 'react-scrollchor' //scroll to anchor in page
import NotificationSystem from 'react-notification-system'
import appScrollbarWidth from '../../lib/appScrollbarWidth'
import Charts from '../Charts' //replace cash flow with stock prices and trader's control panel
import './styles.css'

class AppToolbar extends Component {
  constructor(props) {
    super(props)
    this.chartObject = props.chartObject
    this.scrollbarWidth = 0 //waiting for the width to be determined
    this.handleClick = this.handleClick.bind(this) //children callbacks
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem
    this.scrollbarWidth = appScrollbarWidth()
  }

  _notificationSystem = null

  _addNotification(level, title, message) {
    if (this._notificationSystem) {
      //wait for componentDidMount to provide this reference
      this._notificationSystem.addNotification({
        level: `${level}`,
        title: `${title}`,
        message: `${message}`,
        position: 'tc',
      })
    }
  }

  // ***************************************
  // *** Handle all callbacks from child components ***
  // ***************************************
  handleClick(evt, flag) {
    if (flag === '???') {
      //no flags yet
      console.log('Flag=' + flag)
    } else {
      // https://github.com/igorprado/react-notification-system
      this._addNotification('warning', 'Work In Progress', flag + ' is not ready yet.', 'Work In Progress')
    }
  }

  render() {
    // let scrollchorOffset = -94-this.scrollbarWidth-10
    let scrollchorOffset = -108

    // Create an array of keys, one for each chart that is drawn,
    // to be placed in a toolbar button for the chart picker.
    let chartkeys = this.chartObject ? Object.keys(this.chartObject) : null

    let menuItems = []
    if (chartkeys) {
      menuItems = chartkeys.map(function(keyvalue, index) {
        return (
          <button key={index.toString()}>
            <Scrollchor to={keyvalue.replace(/[\W_]/g, '')} disableHistory={true} animate={{ offset: scrollchorOffset, duration: 500 }} className="nav-link">
              {keyvalue}
            </Scrollchor>
          </button>
        )
      })
    }

    return (
      <div>
        <NotificationSystem ref="notificationSystem" />
        <div className="scrollmenucontainer">
          <div className="scrollmenu">{menuItems}</div>
        </div>
        <Charts chartObject={this.chartObject} handleClick={this.handleClick} />
      </div>
    )
  }
}

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item to FilePanel
// https://www.npmjs.com/package/react-sizes
export default withSizes(mapSizesToProps)(AppToolbar)
