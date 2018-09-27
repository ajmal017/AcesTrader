// redux/reducerTrendLongs.js
// Opened long positions of trend follower stocks

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultTrendExit from '../json/defaultTrendExit.json'
import reduceTargetState from './reduceTargetState.js'
import reduceInsertedObject from './reduceInsertedObject.js'
import reducePeekData from './reducePeekData'
import { REPLACE_POSITION_OBJECT } from './thunkEditListObjects.js'
var cloneDeep = require('lodash.clonedeep')

const UPDATE_DASHBOARD_PEEK_DATA = 'UPDATE_DASHBOARD_PEEK_DATA'
const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const ADD_TREND_LONG_POSITION = 'ADD_TREND_LONG_POSITION'
const REMOVE_TREND_LONG_POSITION = 'CLOSE_TREND_LONG_POSITION'
const REMOVE_ALL_TREND_LONGS = 'REMOVE_ALL_TREND_LONGS'

export const addTrendLongToList = (theObject, thePrice, theQuantity, theQuantityType, theAccount) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  let theObjectArray = [theObject]
  return {
    type: ADD_TREND_LONG_POSITION,
    theObject: theObjectArray,
    theDate: theDate,
    theEvent: 'entered',
    thePrice: thePrice,
    theQuantity: theQuantity,
    theQuantityType: theQuantityType,
    theAccount: theAccount,
  }
}

// NOTE: This object should be moved to results state slice before removing it here
export const removeTrendLongFromList = (symbol, hash) => {
  return {
    type: REMOVE_TREND_LONG_POSITION,
    symbol: symbol,
    hash: hash,
  }
}
export const removeAllTrendLongsFromList = () => {
  return {
    type: REMOVE_ALL_TREND_LONGS,
  }
}

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultTrendLongs = cloneDeep(defaultState.trendlongs) //in case state is undefined

export default function trendlongsReducer(state = defaultTrendLongs, action) {
  switch (action.type) {
    case UPDATE_DASHBOARD_PEEK_DATA: {
      let newState = reducePeekData(state, 'prospects', action.peekdataobject, action.theDate)
      return newState
    }
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.trendlongs) {
        return cloneDeep(action.persistedState.trendlongs) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultTrendLongs)
    }
    case ADD_TREND_LONG_POSITION: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultTrendExit)
      let newState = reduceTargetState(
        state,
        action.theObject,
        newDashboard,
        action.theDate,
        action.theEvent,
        action.thePrice,
        action.theQuantity,
        action.theQuantityType,
        action.theAccount
      )
      return newState
    }
    case REMOVE_TREND_LONG_POSITION: {
      //filter to keep all except the action.symbol one
      // let newState = state.filter((obj) => obj.symbol !== action.symbol)
      let newState = state.filter((obj) => obj.hash !== action.hash)
      return newState
    }
    case REPLACE_POSITION_OBJECT: {
      let hash = action.theObject.hash
      let foundObject = state.find((obj) => obj.hash === hash)
      if (!foundObject) {
        return state //target object is not in this list
      }
      let prunedState = state.filter((obj) => obj.hash !== hash) //remove the old object versiom
      let newState = reduceInsertedObject(prunedState, action.theObject) //replace with new version
      return newState
    }
    case REMOVE_ALL_TREND_LONGS: {
      return cloneDeep(defaultTrendLongs)
    }
    case RESET_DEFAULT_STATE: {
      return cloneDeep(defaultTrendLongs)
    }
    default:
      return state
  }
}
