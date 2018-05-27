//  redux/ducksPlan

import { NEW_PLAN_ALL_SLICES } from '../redux'
import { OPEN_PLAN_ALL_SLICES } from '../redux'
import { RESET_STATE } from '../redux'
import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const SET_SELECTION = 'blueduck.plan.SET_SELECTION'
const SHOW_CHARTS = 'blueduck.plan.SHOW_CHARTS'

export const setSelection = (breadcrumbs) => {
  return {
    type: SET_SELECTION,
    breadcrumbs,
  }
}
export const showCharts = (enabled) => {
  return {
    type: SHOW_CHARTS,
    enabled,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
// Note: This is specifically for the plan's display props,
// the defaultFiles model contains the plan's file data
const defaultPlan = cloneDeep(defaultState.plan) //in case state is undefined

function planReducer(state = defaultPlan, action) {
  switch (action.type) {
    case NEW_PLAN_ALL_SLICES: {
      return defaultPlan
    }
    case OPEN_PLAN_ALL_SLICES: {
      return { ...defaultPlan, selectedTreeNode: action.payload.planInitialSelection }
    }
    case SET_SELECTION: {
      return { ...state, selectedTreeNode: action.breadcrumbs }
    }
    case SHOW_CHARTS: {
      return { ...state, showCharts: action.enabled }
    }
    case RESET_STATE: {
      return defaultPlan // reset this slice
    }
    default:
      return state
  }
}

export default planReducer
