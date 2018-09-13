//  redux/reducerBuys.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongEntry from '../json/defaultLongEntry.json'
import reduceTargetState from './reduceTargetState.js'

var cloneDeep = require('lodash.clonedeep')

const COPY_BUYS_TO_STATE = 'COPY_BUYS_TO_STATE'
const RESET_APP_STATE = 'RESET_APP_STATE'
const ADD_BUYS = 'ADD_BUYS'
const REMOVE_ONE_BUY = 'REMOVE_ONE_BUY'
const REMOVE_ALL_BUYS = 'REMOVE_ALL_BUYS'

export const copyBuysToState = (buysState) => {
  return {
    type: COPY_BUYS_TO_STATE,
    buysState: buysState,
  }
}

export const moveBuysToState = (buysFromStorage) => {
  return {
    type: COPY_BUYS_TO_STATE,
    buysFromStorage: buysFromStorage,
  }
}

export const addBuysToList = (buysList) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_BUYS,
    buysArray: buysList,
    theDate: theDate,
    theEvent: 'watched',
  }
}

// NOTE: If this was bought, then this object should be moved to longs state slice before removing it here
// If this was deleted by user than this is only action performed.
export const removeBuyFromList = (buyName, hash) => {
  return {
    type: REMOVE_ONE_BUY,
    symbol: buyName,
    hash: hash,
  }
}
export const removeAllBuysFromList = () => {
  return {
    type: REMOVE_ALL_BUYS,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultBuys = cloneDeep(defaultState.buys) //in case state is undefined

export default function buysReducer(state = defaultBuys, action) {
  switch (action.type) {
    case ADD_BUYS: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultLongEntry)
      let newState = reduceTargetState(state, action.buysArray, newDashboard, action.theDate, action.theEvent)
      return newState
    }
    case REMOVE_ONE_BUY: {
      //filter to keep all except the action.symbol one
      // let newState = state.filter((obj) => obj.symbol !== action.symbol)
      let newState = state.filter((obj) => obj.hash !== action.hash)
      return newState
    }
    case REMOVE_ALL_BUYS: {
      return cloneDeep(defaultBuys)
    }
    case RESET_APP_STATE: {
      return cloneDeep(defaultBuys)
    }
    case COPY_BUYS_TO_STATE: {
      return cloneDeep(action.buysFromStorage)
    }
    default:
      return state
  }
}
