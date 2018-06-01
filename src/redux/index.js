// redux/index.js

import { combineReducers } from 'redux'
import buysReducer from './reducerBuys'
import sellsReducer from './reducerSells'
import longsReducer from './reducerLongs'
import shortsReducer from './reducerShorts'
import modalReducer from './reducerModal'

//The RESET_STATE is a secret action for use in fixing unique problems.
//Triggered by typing special code string into the SaveAs data entry screen, pressing Cancel.
export const RESET_STATE = 'blueduck.redux.RESET_STATE'
export const NEW_PLAN_ALL_SLICES = 'blueduck.redux.NEW_PLAN_ALL_SLICES'
export const OPEN_PLAN_ALL_SLICES = 'blueduck.redux.OPEN_PLAN_ALL_SLICES'
export const IMPORT_PLAN_ALL_SLICES = 'blueduck.redux.IMPORT_PLAN_ALL_SLICES'
export const resetState = () => {
  return { type: RESET_STATE }
}
// This is used when a new plan is created
export const newPlanAllSlices = () => {
  return {
    type: NEW_PLAN_ALL_SLICES,
    // no payload; reducers just uses the default with appropriate updates
  }
}
export const openPlanAllSlices = (planName, planObject, planInitialSelection, chartObject) => {
  return {
    type: OPEN_PLAN_ALL_SLICES,
    payload: {
      planName: planName,
      planObject: planObject,
      planInitialSelection: planInitialSelection,
      chartObject: chartObject,
    },
  }
}

export const importPlanAllSlices = (planName, planData) => {
  return {
    type: IMPORT_PLAN_ALL_SLICES,
    planName,
    planData,
  }
}

const rootReducer = combineReducers({
  buys: buysReducer,
  sells: sellsReducer,
  longs: longsReducer,
  shorts: shortsReducer,
  modal: modalReducer,
})

export default rootReducer
