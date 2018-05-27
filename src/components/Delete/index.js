// Delete/index.js

import { Component } from 'react'
import { connect } from 'react-redux'
import { deleteUserPlan } from '../../redux/ducksModal'
import { removePlanFromList } from '../../redux/ducksCommon'
import { deletePlan } from '../../redux/localStorage'
import { newPlanAllSlices } from '../../redux'

class Delete extends Component {
  constructor(props) {
    super(props)
    this.targetPlanName = this.props.planName
    this.currentPlanName = this.props.planName
    this.handleDeleteQueryResonse = this.handleDeleteQueryResonse.bind(this)
  }
  // Note that this component is renedered from the AppNav component,
  // and the Delete request refers to the currently rendered plan file.

  handleDeleteQueryResonse(response) {
    let buttonFlag = response.buttonFlag
    // let request = response.request
    // let planName = response.newPlanName
    // let currentPlanName = response.currentPlanName
    let targetPlanName = response.targetPlanName
    // let planObject = response.planObject
    // let chartObject = response.chartObject
    // // debugger //testing reponse content
    if (buttonFlag === 'yes') {
      deletePlan(targetPlanName) // using the localStorage.deletePlan method
      this.props.dispatch(removePlanFromList(targetPlanName))
      // the following is always true (code copied from Select)
      if (this.targetPlanName === this.currentPlanName) {
        this.props.dispatch(newPlanAllSlices())
        this.props.history.push('/forecaster') // load the page showing the new plan
      }
    } else {
      this.props.history.push('/forecaster') // return to show the existing plan
    }
  }

  componentWillMount() {
    this.props.dispatch(deleteUserPlan('delete', this.targetPlanName, this.currentPlanName, this.props.dirty, this.handleDeleteQueryResonse))
  }

  componentWillReceiveProps(nextProps) {
    debugger
  }

  render() {
    return null
  }
}

function mapStateToProps(state) {
  const props = {
    planName: state.files.planName,
    dirty: state.files.dirty,
  }
  return props
}

export default connect(mapStateToProps)(Delete)
