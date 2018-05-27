// New/index.js
import { Component } from 'react'
import { connect } from 'react-redux'
import { unsavedChanges } from '../../redux/ducksModal'
import { newPlanAllSlices } from '../../redux'

class New extends Component {
  constructor(props) {
    super(props)
    this.currentPlanName = this.props.planName
    this.handleModalResonse = this.handleModalResonse.bind(this)
  }

  handleModalResonse = function(response) {
    let buttonFlag = response.buttonFlag
    // let request = response.request
    // let planName = response.newPlanName
    // let planObject = response.planObject
    // let chartObject = response.chartObject
    if (buttonFlag === 'yes') {
      this.loadNewFile()
    } else {
      this.props.history.push('/forecaster') // return to show the existing plan
    }
  }

  loadNewFile = function() {
    this.props.dispatch(newPlanAllSlices())
    this.props.history.push('/forecaster') // load the page showing the rendered result
  }

  componentWillMount() {
    if (this.props.dirty) {
      // notify user about corrective action
      const planObject = null
      const chartObject = null
      this.props.dispatch(unsavedChanges('newplan', 'A New Plan', this.props.planName, planObject, chartObject, this.handleModalResonse))
    } else {
      this.loadNewFile()
    }
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

export default connect(mapStateToProps)(New)
