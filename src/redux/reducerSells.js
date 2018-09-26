// redux/reducerSells.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultShortEntry from '../json/defaultShortEntry.json'
import reduceTargetState from './reduceTargetState.js'
import reduceInsertedObject from './reduceInsertedObject.js'
import { REPLACE_PROSPECT_OBJECT } from './thunkEditListObjects.js'
var cloneDeep = require('lodash.clonedeep')

const UPDATE_DASHBOARD_PEEK_DATA = 'UPDATE_DASHBOARD_PEEK_DATA'
const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const ADD_SELLS = 'ADD_SELLS'
const REMOVE_ONE_SELL = 'REMOVE_ONE_SELL'
const REMOVE_ALL_SELLS = 'REMOVE_ALL_SELLS'

export const addSellstoList = (sellsList) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_SELLS,
    sellsArray: sellsList,
    theDate: theDate,
    theEvent: 'watched',
  }
}
// NOTE: If this was sold short, then this object should be moved to shorts state slice before removing it here
// If this was deleted by user than this is only action performed.
export const removeSellFromList = (symbol, hash) => {
  return {
    type: REMOVE_ONE_SELL,
    symbol: symbol,
    hash: hash,
  }
}
export const removeAllSellsFromList = () => {
  return {
    type: REMOVE_ALL_SELLS,
  }
}

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultSells = cloneDeep(defaultState.sells) //in case state is undefined

export default function sellsReducer(state = defaultSells, action) {
  switch (action.type) {
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.sells) {
        return cloneDeep(action.persistedState.sells) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultSells)
    }
    case ADD_SELLS: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultShortEntry)
      let newState = reduceTargetState(state, action.sellsArray, newDashboard, action.theDate, action.theEvent)
      return newState
    }
    case REMOVE_ONE_SELL: {
      //filter all except the action.symbol one
      // newState = state.filter((obj) => obj.symbol !== action.symbol)
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
    case REMOVE_ALL_SELLS: {
      return cloneDeep(defaultSells)
    }
    case RESET_DEFAULT_STATE: {
      return cloneDeep(defaultSells)
    }
    default:
      return state
  }
}
