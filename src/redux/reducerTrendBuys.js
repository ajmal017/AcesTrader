// redux/reducerTrendBuys.js
// Prospective trend following stocks watching for buy signal

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultTrendEntry from '../json/defaultTrendEntry.json'
import reduceTargetState from './reduceTargetState.js'
import reduceInsertedObject from './reduceInsertedObject.js'
import reducePeekData from './reducePeekData'
import { REPLACE_PROSPECT_OBJECT, REPLACE_EDITED_OBJECT } from './thunkEditListObjects.js'
var cloneDeep = require('lodash.clonedeep')

const UPDATE_DASHBOARD_PEEK_DATA = 'UPDATE_DASHBOARD_PEEK_DATA'
const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const ADD_TREND_BUYS = 'ADD_TREND_BUYS'
const REMOVE_ONE_TREND_BUY = 'REMOVE_ONE_TREND_BUY'
const REMOVE_ALL_TREND_BUYS = 'REMOVE_ALL_TREND_BUYS'

export const addTrendBuysToList = (trendbuysList) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_TREND_BUYS,
    trendbuysList: trendbuysList,
    theDate: theDate,
    theEvent: 'watched',
  }
}

// NOTE: If this was bought, then this object should be moved to trendLongs state slice before removing it here
// If this was deleted by user than this is only action performed.
export const removeTrendBuyFromList = (symbol, hash) => {
  return {
    type: REMOVE_ONE_TREND_BUY,
    symbol: symbol,
    hash: hash,
  }
}
export const removeAllTrendBuysFromList = () => {
  return {
    type: REMOVE_ALL_TREND_BUYS,
  }
}

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultTrendBuys = cloneDeep(defaultState.trendbuys) //in case state is undefined

export default function trendbuysReducer(state = defaultTrendBuys, action) {
  switch (action.type) {
    case UPDATE_DASHBOARD_PEEK_DATA: {
      let newState = reducePeekData(state, 'prospects', action.peekdataobject, action.theDate)
      return newState
    }
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.trendbuys) {
        return cloneDeep(action.persistedState.trendbuys) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultTrendBuys)
    }
    case ADD_TREND_BUYS: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultTrendEntry)
      let newState = reduceTargetState(state, action.trendbuysList, newDashboard, action.theDate, action.theEvent)
      return newState
    }
    case REMOVE_ONE_TREND_BUY: {
      //filter to keep all except the action.symbol one
      // let newState = state.filter((obj) => obj.symbol !== action.symbol)
      let newState = state.filter((obj) => obj.hash !== action.hash)
      return newState
    }
    case REPLACE_PROSPECT_OBJECT: {
      let hash = action.theObject.hash
      let foundObject = state.find((obj) => obj.hash === hash)
      if (!foundObject) {
        return state //target object is not in this list
      }
      let prunedState = state.filter((obj) => obj.hash !== hash) //remove the old object versiom
      let newState = reduceInsertedObject(prunedState, action.theObject) //replace with new version
      return newState
    }
    case REPLACE_EDITED_OBJECT: {
      let hash = action.theObject.hash
      let foundObject = state.find((obj) => obj.hash === hash)
      if (!foundObject) {
        return state //target object is not in this list
      }
      let prunedState = state.filter((obj) => obj.hash !== hash) //remove the old object versiom
      let newState = reduceInsertedObject(prunedState, action.theObject) //replace with new version
      return newState
    }
    case REMOVE_ALL_TREND_BUYS: {
      return cloneDeep(defaultTrendBuys)
    }
    case RESET_DEFAULT_STATE: {
      return cloneDeep(defaultTrendBuys)
    }
    default:
      return state
  }
}
