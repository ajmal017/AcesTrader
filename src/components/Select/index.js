// Select/index.js
// Refs for Export:
// https://developer.mozilla.org/en-US/docs/Web/API/Blob
// https://github.com/eligrey/FileSaver.js
// https://stackoverflow.com/questions/21997057/how-to-use-filesaver-js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileSaver from 'file-saver'
import { loadPlan, deletePlan, loadBase64Plan } from '../../redux/localStorage'
import { openPlanAllSlices, newPlanAllSlices } from '../../redux'
import { notification, unsavedChanges, deleteUserPlan } from '../../redux/ducksModal'
import { removePlanFromList } from '../../redux/ducksCommon'
import FileList from './FileList'

class Select extends Component {
  constructor(props) {
    super(props)
    this.handlePlanClick = this.handlePlanClick.bind(this)
    this.handleExampleClick = this.handleExampleClick.bind(this)
    this.handleLoadQueryResonse = this.handleLoadQueryResonse.bind(this)
    this.handleDeleteQueryResonse = this.handleDeleteQueryResonse.bind(this)
  }

  handlePlanClick(evt, planName, request = 'open') {
    switch (request) {
      case 'open':
        this.okayToLoadUserPlan(request, planName) //query user for yes-no response
        break
      case 'delete':
        this.okayToDeleteUserPlan(request, planName) //query user for yes-no response
        break
      case 'export':
        this.exportPlanFile(planName)
        break
      default:
    }
  }

  handleExampleClick(evt, planName, planObject, chartObject, request = 'open') {
    this.okayToLoadExamplePlan(request, planName, planObject, chartObject)
  }

  permissionGranted() {
    if (this.props.dirty) {
      return this.props.planName //returning a dirty file name is denying permission
    }
    return null //returning null grants permission
  }

  okayToLoadUserPlan(request, newPlanName) {
    if (newPlanName.includes('Dummy user plan name')) {
      this.triggerDummyUserPlanError(newPlanName)
    } else {
      const currentPlanName = this.permissionGranted() // returns name of plan with unsaved buffer to indicate permissionGranted=false
      if (currentPlanName === null) {
        this.loadThePlan(newPlanName)
      } else {
        this.triggerUnsavedChangesModal(request, newPlanName, currentPlanName)
      }
    }
  }

  okayToLoadExamplePlan(request, newPlanName, planObject, chartObject) {
    const currentPlanName = this.permissionGranted() // investigate state for status of plan buffers to determine permissionGranted value
    if (currentPlanName === null) {
      this.loadThePlan(newPlanName, planObject, chartObject)
    } else {
      this.triggerUnsavedChangesModal(request, newPlanName, currentPlanName, planObject, chartObject)
    }
  }

  triggerDummyUserPlanError(planName) {
    const noticeCode = 'dummyplanname'
    this.props.dispatch(notification(noticeCode))
  }

  triggerUnsavedChangesModal(request, newPlanName, currentPlanName, planObject = null, chartObject = null) {
    this.props.dispatch(unsavedChanges(request, newPlanName, currentPlanName, planObject, chartObject, this.handleLoadQueryResonse))
  }

  handleLoadQueryResonse(response) {
    // let request = response.request
    let buttonFlag = response.buttonFlag
    let planName = response.newPlanName
    // let currentPlanName = response.currentPlanName
    // let targetPlanName = response.targetPlanName
    let planObject = response.planObject
    let chartObject = response.chartObject
    // debugger //testing reponse content
    if (buttonFlag === 'yes') {
      this.loadThePlan(planName, planObject, chartObject)
    } else {
      this.props.history.push('/forecaster') // reload current page
    }
  }

  loadThePlan(planName, planObject = null, chartObject = null) {
    if (planObject === null) {
      //All new format plans are saved as base64 encoded json characters
      // This planObject is obtained from the localStorage.loadPlan method
      planObject = loadPlan(planName)
    }
    const planInitialSelection = 'forecaster.parameters.params.0'
    this.props.dispatch(openPlanAllSlices(planName, planObject, planInitialSelection, chartObject))
    this.props.history.push('/forecaster') // load the page showing the rendered result
  }

  okayToDeleteUserPlan(request, targetPlanName) {
    this.props.dispatch(deleteUserPlan(request, targetPlanName, this.props.planName, this.props.dirty, this.handleDeleteQueryResonse))
    // if (targetPlanName.includes('Dummy user plan name')) {
    //   this.triggerDummyUserPlanError(targetPlanName)
    // } else {
    //   this.props.dispatch(deleteUserPlan(request, targetPlanName, this.props.planName, this.props.dirty, this.handleDeleteQueryResonse))
    // }
  }

  handleDeleteQueryResonse(response) {
    // let request = response.request
    let buttonFlag = response.buttonFlag
    // let planName = response.newPlanName
    let currentPlanName = response.currentPlanName
    let targetPlanName = response.targetPlanName
    // let planObject = response.planObject
    // let chartObject = response.chartObject
    if (buttonFlag === 'yes') {
      deletePlan(targetPlanName) // using the localStorage.deletePlan method
      this.props.dispatch(removePlanFromList(targetPlanName))
      if (targetPlanName === currentPlanName) {
        this.props.dispatch(newPlanAllSlices())
      }
    }
    this.props.history.push('/select')
  }

  exportPlanFile(planName) {
    try {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      if (iOS) {
        const err = 'error'
        throw err // don't do exports under iOS
      }
      const planFile = loadBase64Plan(planName)
      var blob = new Blob([planFile], { type: 'application/json' })
      FileSaver.saveAs(blob, planName + '.mpx')
      const noticeCode = 'exportedplan'
      this.props.dispatch(notification(noticeCode))
    } catch (e) {
      const noticeCode = 'noexport'
      this.props.dispatch(notification(noticeCode))
    }
  }

  render() {
    return (
      <div>
        <FileList
          dirty={this.props.dirty}
          planName={this.props.planName}
          handlePlanClick={this.handlePlanClick}
          handleExampleClick={this.handleExampleClick}
          plansList={this.props.plansList}
        />
      </div>
    )
  }

  // Look for prop changes that require new action dispatches.
  // We have access to both the next props (via nextProps),
  // and our current props (via this.props).
  componentWillReceiveProps(nextProps) {
    // if (this.props.plansList !== nextProps.plansList) {
    // A plan was deleted
    // this.deletePlanRequested = null //reset
    // console.log('this.props.plansList !==nextProps.plansList')
    // }
  }
}

// Use mapStateToProps to set props with the status flags
// set by the reducers of other state slices, then
// test the props in componentWillReceiveProps looking
// for status changes that require new action dispatches.
function mapStateToProps(state) {
  const props = {
    exampleChartObject: state.files.exampleChartObject,
    planName: state.files.planName,
    planObject: state.files.planObject,
    plansList: state.common.plansList,
    dirty: state.files.dirty,
    chartObject: state.charts.chartObject,
    montecarloAllowed: state.charts.montecarloAllowed,
    selectedTreeNode: state.plan.selectedTreeNode,
    showCharts: state.plan.showCharts,
  }
  return props
}

export default connect(mapStateToProps)(Select)
