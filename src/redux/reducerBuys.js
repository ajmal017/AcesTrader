//  redux/reducerBuys.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongEntry from '../json/defaultLongEntry.json'
import reduceTargetState from './reduceTargetState.js'

var cloneDeep = require('lodash.clonedeep')

const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const ADD_BUYS = 'ADD_BUYS'
const REMOVE_ONE_BUY = 'REMOVE_ONE_BUY'
const REMOVE_ALL_BUYS = 'REMOVE_ALL_BUYS'

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

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultBuys = cloneDeep(defaultState.buys) //in case state is undefined

export default function buysReducer(state = defaultBuys, action) {
  switch (action.type) {
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.buys) {
        return cloneDeep(action.persistedState.buys) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultBuys)
    }
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
    case RESET_DEFAULT_STATE: {
      return cloneDeep(defaultBuys)
    }
    default:
      return state
  }
}
