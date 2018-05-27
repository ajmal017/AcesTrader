// Save
//import React from 'react'
import { connect } from 'react-redux'
import { notification } from '../../redux/ducksModal'
import { saveToStorage } from '../../redux/ducksFiles'
import { addPlanToList } from '../../redux/ducksCommon'
import exampleFileNames from '../../lib/exampleFileNames.json'
var F = require('../../lib/fobj') //gets the static object of constants

const Save = (props) => {
  'use-strict'

  // NOTE: Save should not check for allowed plan count since this is an update to an existing plan
  // // Check for maximum allowed saved plans
  // let useridTokens = props.planObject.forecaster.meta.userid.split('-')
  // if (useridTokens) {
  //   let maxAllowed = parseInt(useridTokens[1]) //userid format is "NAME-maxvalue"
  //   if (props.plansList.length > maxAllowed - 1) {
  //     const noticeCode = 'maxsaved'
  //     props.dispatch(notification(noticeCode))
  //     props.history.push('/forecaster') // restore the existing page
  //     return null
  //   }
  // }

  // Check the plan name for Untitled which can not be saved
  if (props.planName === F.UNTITLEDFILENAME) {
    const noticeCode = 'saveuntitled'
    props.dispatch(notification(noticeCode))
    props.history.push('/forecaster') // restore the existing page
    return null
  }

  // 1st check for example plan which can not be saved
  const nameLower = props.planName.toLowerCase()
  var exampleNames = exampleFileNames[0].fileNames.filter((name, index) => {
    return name === nameLower
  })
  if (exampleNames && exampleNames.length > 0) {
    const noticeCode = 'saveexample'
    props.dispatch(notification(noticeCode))
    props.history.push('/saveas') // restore the existing page
    return null
  }

  // 2nd check for example plan which can not be saved
  if (props.planObject.forecaster.meta && props.planObject.forecaster.meta.examplefile) {
    const noticeCode = 'saveexample'
    props.dispatch(notification(noticeCode))
    props.history.push('/saveas') // restore the existing page
    return null
  }

  // Save user plan to local storage
  props.dispatch(saveToStorage(props.planName, props.planObject))
  props.dispatch(addPlanToList(props.planName)) // add plan name to plansList array
  props.history.push('/forecaster') // restore the existing page
  return null
}

function mapStateToProps(state) {
  const props = {
    planName: state.files.planName,
    planObject: state.files.planObject,
    plansList: state.common.plansList,
  }
  return props
}

export default connect(mapStateToProps)(Save)
