//  redux/reducerLongs.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongExit from '../json/defaultLongExit.json'
import reduceTargetState from './reduceTargetState.js'
import reduceInsertedObject from './reduceInsertedObject.js'
import reducePeekData from './reducePeekData'
import { REPLACE_POSITION_OBJECT, REPLACE_EDITED_OBJECT } from './thunkEditListObjects.js'
var cloneDeep = require('lodash.clonedeep')

const UPDATE_DASHBOARD_PEEK_DATA = 'UPDATE_DASHBOARD_PEEK_DATA'
const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const ADD_LONG_POSITION = 'ADD_LONG_POSITION'
const REMOVE_LONG_POSITION = 'REMOVE_LONG_POSITION'
const REMOVE_ALL_LONGS = 'REMOVE_ALL_LONGS'

export const addLongToList = (theObject, thePrice, theQuantity, theQuantityType, theAccount) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  let theObjectArray = [cloneDeep(theObject)]
  return {
    type: ADD_LONG_POSITION,
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
export const removeLongFromList = (symbol, hash) => {
  return {
    type: REMOVE_LONG_POSITION,
    symbol: symbol,
    hash: hash,
  }
}
export const removeAllLongsFromList = () => {
  return {
    type: REMOVE_ALL_LONGS,
  }
}

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultLongs = cloneDeep(defaultState.longs) //in case state is undefined

export default function longsReducer(state = defaultLongs, action) {
  switch (action.type) {
    case UPDATE_DASHBOARD_PEEK_DATA: {
      let newState = reducePeekData(state, action.peekdataobject, action.theDate)
      return newState
    }
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.longs) {
        return cloneDeep(action.persistedState.longs) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultLongs)
    }
    case ADD_LONG_POSITION: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultLongExit)
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
    case REMOVE_LONG_POSITION: {
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
    case REMOVE_ALL_LONGS: {
      return cloneDeep(defaultLongs)
    }
    case RESET_DEFAULT_STATE: {
      return cloneDeep(defaultLongs)
    }
    default:
      return state
  }
}
