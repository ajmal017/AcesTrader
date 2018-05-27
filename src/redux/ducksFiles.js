//  redux/ducksFiles

// import { savePlan, loadGlobalData, saveGlobalData } from '../redux/localStorage'
import { savePlan } from '../redux/localStorage'
import { objectQuery } from '../lib/navigateBreadCrumbs'
import { NEW_PLAN_ALL_SLICES } from '../redux'
import { OPEN_PLAN_ALL_SLICES } from '../redux'
import { IMPORT_PLAN_ALL_SLICES } from '../redux'
import { RESET_STATE } from '../redux'
import defaultState from '../json/defaultState.json'
import defaultPlan from '../json/defaultPlan.json' // This import creates a POJO single element array containing the default plan object,

var makeplanobject = require('./fileProcessing/makeplanobject') //parses the planData string to create plan object
var makecrumbs = require('./fileProcessing/makebreadcrumbs') //parses the plan object to install the breadcrumbs
var cloneDeep = require('lodash.clonedeep')
var F = require('../lib/fobj') //gets the static object of constants

const OPEN_REQUEST = 'blueduck.files.OPEN_REQUEST'
const OPEN_SUCCESS = 'blueduck.files.OPEN_SUCCESS'
const OPEN_FAILURE = 'blueduck.files.OPEN_FAILURE'
const TOGGLE_DISABLED = 'blueduck.files.TOGGLE_DISABLED'
const SAVE_TO_STORAGE = 'blueduck.files.SAVE_TO_STORAGE'

export const openRequest = () => {
  return {
    type: OPEN_REQUEST,
  }
}
export const openSuccess = (planJson) => {
  // TODO This needs tp be merged with the openPlanAllSlices() action
  return {
    type: OPEN_SUCCESS,
    planJson,
  }
}
export const openFailure = (errorNumber, errorMessage) => {
  return {
    type: OPEN_FAILURE,
    payload: {
      errorNumber: errorNumber,
      errorMessage: errorMessage,
    },
  }
}
// export const newPlanLoaded = (json, planName, breadcrumbs) => {
//   return {
//     type: NEW_PLAN_LOADED,
//     json,
//     planName,
//     breadcrumbs,
//   }
// }
export const toggleDisabled = (breadcrumbs, breadcrumbsParent) => {
  return {
    type: TOGGLE_DISABLED,
    breadcrumbs,
    breadcrumbsParent,
  }
}

export const saveToStorage = (planName, planObject, isExample = false) => {
  return {
    type: SAVE_TO_STORAGE,
    planName,
    planObject,
    isExample, //optional parameter, default is false
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well:
// The defaultFiles model contains plan meta data and plan file data
// as read from storage or as imported by users.
// Possible formats include base64 as the coded storage format,
// decoded XML from legacy user files,
// or decoded JSON from the new ".mpx" file format.
const defaultFiles = cloneDeep(defaultState.files) //in case state is undefined
defaultFiles.planObject = cloneDeep(defaultPlan) //fill in the missing default plan object
defaultFiles.planName = F.UNTITLEDFILENAME

export default function filesReducer(state = defaultFiles, action) {
  'use-strict'
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  switch (action.type) {
    case NEW_PLAN_ALL_SLICES: {
      let newState = cloneDeep(defaultFiles) // clone a new copy for this modification
      newState.planObject.forecaster.meta.createdate = theDate
      newState.planObject.forecaster.meta.savedate = theDate
      newState.planName = F.UNTITLEDFILENAME
      return { ...newState, dirty: false }
    }
    // To handle legacy Forecaster plan files, we have to add breadcrumbs to the object model.
    // The makepath() method expects its input to be an object holding the legacy object.
    // This method can be called with plan objects already having breadcrumbs without side effects.
    case IMPORT_PLAN_ALL_SLICES: {
      let newState = cloneDeep(defaultFiles) // clone a new copy for this modification
      //CREATE THE PLANOBJECT FROM PLANDATA HERE
      let dataStore = {}
      dataStore.planName = action.planName
      dataStore.planFileData = action.planData
      dataStore.planObject = null //to be provided
      makeplanobject.makeobject(dataStore) //create planObject, planJson, planJsonBase64 in dataStore
      let thePlanObject = dataStore.planObject //the finished planObject
      const fixedPlanObject = makecrumbs.makepath({ planObject: thePlanObject })
      newState.planObject = fixedPlanObject //as converted from the planObject
      newState.planJson = JSON.stringify(fixedPlanObject)
      newState.planName = action.planName
      // newState.planObject.forecaster.meta['examplefile'] = false
      newState.planObject.forecaster.meta['userid'] = 'FREEWARE-5' //limit user to 5 saved plans
      newState.planObject.forecaster.meta['savedate'] = theDate //a new property
      const createDate = newState.planObject.forecaster.meta['createdate']
      newState.planObject.forecaster.meta['createdate'] = createDate ? createDate : theDate
      let response = savePlan(action.planName, fixedPlanObject) // save to localStorage
      if (!response) {
        alert("ERROR! Your computer's local storage is full. MoneyPlan can not save your work. Please increase your space quota or do some clean-up")
      }
      return { ...newState, dirty: false }
    }
    case SAVE_TO_STORAGE: {
      const oldName = state.planName
      let newState = cloneDeep(state) // clone a new copy for this modification
      newState.planObject = action.planObject
      newState.planObject.forecaster.meta['examplefile'] = action.isExample //optional parameter, default is false
      newState.planObject.forecaster.meta['userid'] = 'FREEWARE-5' //limit user to 5 saved plans
      newState.planObject.forecaster.meta['savedate'] = theDate //a new property
      if (oldName !== action.planName) {
        newState.planObject.forecaster.meta['createdate'] = theDate
      }
      newState.planName = action.planName
      newState.planJson = JSON.stringify(action.planObject)
      let response = savePlan(action.planName, newState.planObject) // save to localStorage
      if (!response) {
        alert("ERROR! Your computer's local storage is full. MoneyPlan can not save your work. Please increase your space quota or do some clean-up")
      }
      return { ...newState, dirty: false }
    }
    case OPEN_PLAN_ALL_SLICES: {
      let newState = cloneDeep(defaultFiles) // clone a new copy for this modification
      const fixedPlanObject = makecrumbs.makepath({ planObject: action.payload.planObject })
      newState.planObject = fixedPlanObject //as conveted from the action planObject
      newState.planName = action.payload.planName
      return { ...newState, dirty: false }
    }
    case TOGGLE_DISABLED: {
      let newState = cloneDeep(state) // clone a new copy for this modification
      let object = objectQuery(action.breadcrumbs, newState.planObject) // point to target object
      object.ignorenow = !object.ignorenow // toggle the "ignorenow" property in target object
      return { ...newState, dirty: true, staleCharts: true }
    }
    case OPEN_REQUEST: {
      return { ...state, loading: true }
    }
    case OPEN_FAILURE: {
      return { ...state, loading: false, error: action.payload }
    }
    case OPEN_SUCCESS: {
      return { ...state, loading: false, loaded: true, planJson: action.planJson }
    }
    case RESET_STATE: {
      return defaultFiles // reset this slice
    }
    default:
      return state
  }
}

// ****Note: the code below is left for reference to show an example use of breadcrumbs****Feb 2018****
// let index = parseInt(breadcrumbs.substring(breadcrumbs.lastIndexOf('.') + 1))
// let array = objectQuery(breadcrumbsParent, state.planObject).slice(0) //new copy of the array
// let object = array[index] //get object from the new array
// // let object = objectQuery(breadcrumbs, state.planObject)
// object.ignorenow = !object.ignorenow // toggle the "ignorenow" property in array copy
// // Put the new array into state (how??)
// return state
