// AppToolbar/index.js

import React, { Component } from 'react'
import withSizes from 'react-sizes'
import Scrollchor from 'react-scrollchor' //scroll to anchor in page
import NotificationSystem from 'react-notification-system'
import appScrollbarWidth from '../../lib/appScrollbarWidth'
import Charts from '../Charts' //to hold stock price chart and dashboard control panel
import './styles.css'

class AppToolbar extends Component {
  constructor(props) {
    super(props)
    this.chartListObject = props.chartObject
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

    // The chartListObject is an array of objects, each one having a symbol property and a dashboard property.
    // Create an array of key values, one for each chart cell that will be drawn,
    // to be placed in a button on this toolbar for the chart picker.

    // TODO ***This code needs to be changed to work with the array of objects***
    let chartkeys = this.chartListObject ? Object.keys(this.chartListObject) : null
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
        <Charts chartListObject={this.chartListObject} handleClick={this.handleClick} />
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
