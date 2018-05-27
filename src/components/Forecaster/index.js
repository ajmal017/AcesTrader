// Forecaster
// import { ParmChange, Clear, Clone, InflateIndividualYearlyGiftTaxExclusion, Revise } from '../../classes/ClassParmChange/ClassParmChange.js'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleDisabled } from '../../redux/ducksFiles'
import { setSelection, showCharts } from '../../redux/ducksPlan'
import ErrorBoundary from '../../components/ErrorBoundary/'
import AppView from '../../components/AppView'
import { notification } from '../../redux/ducksModal'
import { markAsInitialized } from '../../redux/ducksCommon'
// eslint-disable-next-line
import NotificationSystem from 'react-notification-system'
// import { blueduck } from "../../lib/IconsLookup";

class Forecaster extends Component {
  constructor(props) {
    super(props)
    this.chartPickDone = false //switch to flag the presence of a hash url in history
    this.handleClick = this.handleClick.bind(this)
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

  componentWillMount() {
    if (!this.props.initialized) {
      this.props.dispatch(markAsInitialized())
      this.props.history.push('/home') //Show Home page on first time use with an initial state
    }
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem
  }

  // ***************************************
  // *** Handle all callbacks from child components ***
  // ***************************************
  handleClick(evt, flag, breadcrumbs, breadcrumbsParent) {
    if (flag === 'charts') {
      if (this.props.chartObject) {
        this.props.dispatch(showCharts(true)) //create new state to show the charts
      } else {
        this.props.dispatch(notification('nochartinputdata')) //can not show charts
      }
    } else if (flag === 'planview') {
      this.props.dispatch(showCharts(false)) //create new state to show charts
    } else if (flag === 'chartpicker') {
      this.chartPickDone = true // flags a possible presence of a chart hash url
    } else if (flag === 'newplan') {
      this.props.history.push('/new')
    } else if (flag === 'select') {
      this.props.history.push('/select')
    } else if (flag === 'save') {
      this.props.history.push('/save')
    } else if (flag === 'montecarlo') {
      this.props.history.push('/montecarlo')
    } else if (flag === 'disabled') {
      this._addNotification('info', 'Information', 'This button is disabled.')
    } else {
      if (breadcrumbs) {
        if (flag === 'selectnode') {
          this.props.dispatch(setSelection(breadcrumbs)) //create new state with new selection
        }
        if (flag === 'toggledisable') {
          this.props.dispatch(toggleDisabled(breadcrumbs, breadcrumbsParent)) //create new state with a toggled instruction node
        }
      } else {
        // https://github.com/igorprado/react-notification-system
        this._addNotification('warning', 'Work In Progress', flag + ' is not ready yet.', 'Work In Progress')
      }
    }
  }

  render() {
    const dataStore = {
      exampleChartObject: this.props.exampleChartObject,
      planName: this.props.planName,
      planObject: this.props.planObject,
      chartObject: this.props.chartObject,
      montecarloAllowed: this.props.montecarloAllowed,
      selectedTreeNode: this.props.selectedTreeNode,
      showCharts: this.props.showCharts,
    }

    if (this.chartPickDone === true) {
      //user clicked the ChartPicker toolbar
      this.chartPickDone = false //reset the one-time switch
      if (dataStore.showCharts === true) {
        //scrolling to the anchor hash tag of the picked Chart page now
        this.props.history.push('/forecaster') // removes the chart hash route in url history
      }
    }

    return (
      <div>
        <ErrorBoundary>
          <NotificationSystem ref="notificationSystem" />
          <AppView dirty={this.props.dirty} dataStore={dataStore} handleClick={this.handleClick} />
        </ErrorBoundary>
      </div>
    )
  }

  // Look for prop changes that require new action dispatches.
  // We have access to both the next props (via nextProps),
  // and our current props (via this.props).
  // componentWillReceiveProps(nextProps) {}
}

// Use mapStateToProps to set props with the status flags
// set by the reducers of all state slices, then
// test the props in componentWillReceiveProps looking
// for prop changes that require new action dispatches.
function mapStateToProps(state) {
  const props = {
    exampleChartObject: state.files.exampleChartObject,
    planName: state.files.planName,
    dirty: state.files.dirty,
    planObject: state.files.planObject,
    chartObject: state.charts.chartObject,
    montecarloAllowed: state.charts.montecarloAllowed,
    selectedTreeNode: state.plan.selectedTreeNode,
    showCharts: state.plan.showCharts,
    initialized: state.common.initialized,
  }
  if (process.env.NODE_ENV === 'development') {
    if (props.planObject === 'undefined') {
      debugger //developer testing
    }
  }
  return props
}

export default connect(mapStateToProps)(Forecaster)
