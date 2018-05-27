//  redux/duckCommon

// ** The state.common model holds data relevant to all plans
import { NEW_PLAN_ALL_SLICES } from '../redux'
import { OPEN_PLAN_ALL_SLICES } from '../redux'
import { RESET_STATE } from '../redux'

import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const MARK_AS_INITIALIZED = 'blueduck.common.MARK_AS_INITIALIZED'
const UPDATE_COMMON = 'blueduck.common.UPDATE_COMMON'
const NEW_VERSION_NUMBER = 'blueduck.common.NEW_VERSION_NUMBER'
const ADD_PLAN_TO_LIST = 'blueduck.common.ADD_PLAN_TO_LIST'
const REMOVE_PLAN_FROM_LIST = 'blueduck.common.REMOVE_PLAN_FROM_LIST'
const RECOVER_ALL_PLANS_TO_LIST = 'blueduck.common.RECOVER_ALL_PLANS_TO_LIST'

export const markAsInitialized = () => {
  return {
    type: MARK_AS_INITIALIZED,
  }
}

//Parameters are string values
export const updateCommon = (date, version) => {
  return {
    type: UPDATE_COMMON,
    date,
  }
}
//Parameters are string values
export const newVersionNumber = (date, version) => {
  return {
    type: NEW_VERSION_NUMBER,
    date,
    version,
  }
}
export const addPlanToList = (planName) => {
  return {
    type: ADD_PLAN_TO_LIST,
    planName,
  }
}
export const removePlanFromList = (planName) => {
  return {
    type: REMOVE_PLAN_FROM_LIST,
    planName,
  }
}
export const recoverAllPlansToList = (date) => {
  return {
    type: RECOVER_ALL_PLANS_TO_LIST,
    date,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultCommon = cloneDeep(defaultState.common) //in case state is undefined

export default function commonReducer(state = defaultCommon, action) {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  switch (action.type) {
    case MARK_AS_INITIALIZED: {
      let newState = cloneDeep(state) // clone a new copy for this modification
      newState.initialized = true
      newState.initializedDate = theDate
      return newState
    }
    case NEW_PLAN_ALL_SLICES: {
      // existing common data remains the same
      return state
    }
    case OPEN_PLAN_ALL_SLICES: {
      // existing common data remains the same
      return state
    }
    case UPDATE_COMMON: {
      //NOTE TO SELF: WHAT IS THIS FOR? REMOVE?
      let newState = cloneDeep(state) // clone a new copy for this modification
      newState.initializedDate = action.initializedDate
      return newState
    }
    case NEW_VERSION_NUMBER: {
      let newState = cloneDeep(state) // clone a new copy for this modification
      //save all the existing user plan names in the plansList array
      newState.newVersionDate = action.date
      newState.currentVersion = action.version
      return newState
    }
    case ADD_PLAN_TO_LIST: {
      //Add a plan name to the plansList array
      let newState = cloneDeep(state) // clone a new copy for this modification
      let dupNames = []
      dupNames = state.plansList.filter((name, index) => {
        return name === action.planName
      })
      if (dupNames.length === 0) {
        newState.plansList.unshift(action.planName) // add new name as first in list
        newState.newPlansListDate = theDate
      }
      return newState
    }
    case REMOVE_PLAN_FROM_LIST: {
      //Remove a plan name from the current plansList array
      let newState = cloneDeep(state) // clone a new copy for this modification
      newState.plansList = [] // create an empty array
      newState.plansList = state.plansList.filter((name, index) => {
        return name !== action.planName
      })
      newState.newPlansListDate = theDate
      return newState
    }
    case RECOVER_ALL_PLANS_TO_LIST: {
      //Rebuild the plansList array
      let newState = cloneDeep(state) // clone a new default copy for this modification
      newState.newPlansListDate = action.date
      for (var index = 0, len = localStorage.length; index < len; index++) {
        var key = localStorage.key(index)
        if (key !== 'mp-state') {
          newState.plansList.unshift(key) // add plan name to list of defaults
        }
      }
      return newState
    }
    case RESET_STATE: {
      return defaultCommon // reset this slice
    }
    default:
      return state
  }
}
