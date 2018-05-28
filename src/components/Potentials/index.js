// Potentials/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { notification } from '../../redux/ducksModal'
import NotificationSystem from 'react-notification-system'
import AppToolbar from '../../components/AppToolbar'

// this is to get one chart's data for this mock display
import examplechartdata from '../../components/Charts/examplechartdata'

class Potentials extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this) //children callbacks
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

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem
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
    // Get an example chart data for mock display from a multidata json file
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
      <div>
        <NotificationSystem ref="notificationSystem" />
        <AppToolbar chartObject={chartObject} handleClick={this.handleClick} />
      </div>
    )
  }
}
export default Potentials
