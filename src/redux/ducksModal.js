//  redux/ducksModal.js

import uuidv4 from 'uuid/v4'
import defaultState from '../json/defaultState.json'
import { NEW_PLAN_ALL_SLICES } from '../redux'
import { OPEN_PLAN_ALL_SLICES } from '../redux'

const DELETE_USER_PLAN = 'blueduck.modal.DELETE_USER_PLAN'
const UNSAVED_CHANGES = 'blueduck.modal.UNSAVED_CHANGES'
const NOTIFICATION = 'blueduck.modal.NOTIFICATION'

var cloneDeep = require('lodash.clonedeep')

export const deleteUserPlan = (request, targetPlanName, currentPlanName, dirty, handleModalResonse) => {
  return {
    type: DELETE_USER_PLAN,
    payload: {
      request: request,
      targetPlanName: targetPlanName,
      currentPlanName: currentPlanName,
      dirty: dirty,
      handleModalResonse: handleModalResonse,
    },
  }
}
export const unsavedChanges = (request, newPlanName, currentPlanName, planObject, chartObject, handleModalResonse) => {
  return {
    type: UNSAVED_CHANGES,
    payload: {
      request: request,
      newPlanName: newPlanName,
      currentPlanName: currentPlanName,
      planObject: planObject,
      chartObject: chartObject,
      handleModalResonse: handleModalResonse,
    },
  }
}
export const notification = (noticeCode) => {
  return {
    type: NOTIFICATION,
    payload: { noticeCode: noticeCode },
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
// The defaultModal model contains no modal data properties,
// it returns a state with parameters for the modal reducer to use
// to create the modal display.
const defaultModal = cloneDeep(defaultState.modal) //in case state is undefined

export default function modalReducer(state = defaultModal, action) {
  switch (action.type) {
    case NEW_PLAN_ALL_SLICES: {
      return state
    }
    case OPEN_PLAN_ALL_SLICES: {
      return state
    }

    // If this modal component receives the same state from mapStateToProps()
    // each time the unsavedChanges() action creator is called, then by default react
    // doesn't re-render the DOM, so the modal is not shown again as desired.
    // This occurs when the user fails to correct the unsaved changes problem,
    // and then trys to open the same new plan again.
    // For this situation we include a unique hash to force a state change
    // even when the user activates this again with same parameters.
    // Without the hash, the modal dialog is not rendered again even if there is still a problem.
    // Actually it makes sense to always render the modal dialog
    // each time any action is received, so we always include a hash.

    // Note to self: These changes to the modal state trigger a render at
    // PortalModal via the props created in its mapStateToProps() method.

    case DELETE_USER_PLAN: {
      const returnState_D = { ...defaultModal, ...action.payload, dialogSelector: 'deleteuserplan', hash: uuidv4() }
      // debugger
      return returnState_D //returnState_D const created for developer inspection before returning
    }

    case UNSAVED_CHANGES: {
      const returnState_U = { ...defaultModal, ...action.payload, dialogSelector: 'unsavedChanges', hash: uuidv4() }
      return returnState_U // returnState_U const created for developer inspection before returning
    }

    case NOTIFICATION: {
      const returnState_N = { ...defaultModal, ...action.payload, dialogSelector: 'notification', hash: uuidv4() }
      return returnState_N // returnState_N const created for developer inspection before returning
    }
    default:
      return state
  }
}
