// redux/reducerShorts.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultShortExit from '../json/defaultShortExit.json'
import reduceTargetState from './reduceTargetState.js'
import reduceInsertedObject from './reduceInsertedObject.js'
import reducePeekData from './reducePeekData'
import { REPLACE_POSITION_OBJECT, REPLACE_EDITED_OBJECT } from './thunkEditListObjects.js'
var cloneDeep = require('lodash.clonedeep')

const UPDATE_DASHBOARD_PEEK_DATA = 'UPDATE_DASHBOARD_PEEK_DATA'
const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const ADD_SHORT_POSITION = 'ADD_SHORT_POSITION'
const REMOVE_SHORT_POSITION = 'REMOVE_SHORT_POSITION'
const REMOVE_ALL_SHORTS = 'REMOVE_ALL_SHORTS'

export const addShortToList = (theObject, thePrice, theQuantity, theQuantityType, theAccount) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  let theObjectArray = [theObject]
  return {
    type: ADD_SHORT_POSITION,
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
// If this was deleted by user than this is only action performed.
export const removeShortFromList = (symbol, hash) => {
  return {
    type: REMOVE_SHORT_POSITION,
    symbol: symbol,
    hash: hash,
  }
}
export const removeAllShortsFromList = () => {
  return {
    type: REMOVE_ALL_SHORTS,
  }
}

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultShorts = cloneDeep(defaultState.shorts) //in case state is undefined

export default function chartsReducer(state = defaultShorts, action) {
  switch (action.type) {
    case UPDATE_DASHBOARD_PEEK_DATA: {
      let newState = reducePeekData(state, action.peekdataobject, action.theDate)
      return newState
    }
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.shorts) {
        return cloneDeep(action.persistedState.shorts) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultShorts)
    }
    case ADD_SHORT_POSITION: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultShortExit)
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
    case REMOVE_SHORT_POSITION: {
      //filter to keep all except the action.hash one
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
    case REMOVE_ALL_SHORTS: {
      return cloneDeep(defaultShorts)
    }
    case RESET_DEFAULT_STATE: {
      return cloneDeep(defaultShorts)
    }
    default:
      return state
  }
}
