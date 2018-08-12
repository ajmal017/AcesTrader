//  redux/reducerModal.js

import uuidv4 from 'uuid/v4'
import defaultState from '../json/defaultState.json'

const QUERY_DELETE_TRADE_OBJECT = 'QUERY_DELETE_TRADE_OBJECT'
const QUERY_RESET_LOCAL_STORAGE = 'QUERY_RESET_LOCAL_STORAGE'
const QUERY_CLEAR_ONE_PROSPECTS_LIST = 'QUERY_CLEAR_ONE_PROSPECTS_LIST'
const NOTIFICATION = 'NOTIFICATION'

var cloneDeep = require('lodash.clonedeep')

export const querydeleteTradeObject = (handleModalResonse) => {
  return {
    type: QUERY_DELETE_TRADE_OBJECT,
    payload: {
      handleModalResonse: handleModalResonse,
    },
  }
}
export const queryresetlocalstorage = (handleModalResonse) => {
  return {
    type: QUERY_RESET_LOCAL_STORAGE,
    payload: {
      handleModalResonse: handleModalResonse,
    },
  }
}

export const queryClearProspectsList = (targetListName, handleModalResonse) => {
  return {
    type: QUERY_CLEAR_ONE_PROSPECTS_LIST,
    payload: {
      targetListName: targetListName,
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

    case QUERY_DELETE_TRADE_OBJECT: {
      const returnState_TO = { ...defaultModal, ...action.payload, dialogSelector: 'deletetradeobject', hash: uuidv4() }
      // debugger
      return returnState_TO //the returnState_S const is created for developer inspection before returning
    }

    case QUERY_RESET_LOCAL_STORAGE: {
      const returnState_S = { ...defaultModal, ...action.payload, dialogSelector: 'resetlocalstorage', hash: uuidv4() }
      // debugger
      return returnState_S //the returnState_S const is created for developer inspection before returning
    }

    case QUERY_CLEAR_ONE_PROSPECTS_LIST: {
      const returnState_D = { ...defaultModal, ...action.payload, dialogSelector: 'clearprospectlist', hash: uuidv4() }
      // debugger
      return returnState_D //the returnState_D const is created for developer inspection before returning
    }

    case NOTIFICATION: {
      const returnState_N = { ...defaultModal, ...action.payload, dialogSelector: 'notification', hash: uuidv4() }
      return returnState_N // returnState_N const created for developer inspection before returning
    }
    default:
      return state
  }
}
