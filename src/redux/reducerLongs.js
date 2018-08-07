//  redux/reducerLongs.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongExit from '../json/defaultLongExit.json'
import reduceTargetState from './reduceTargetState.js'
var cloneDeep = require('lodash.clonedeep')

const RESET_APP_STATE = 'RESET_APP_STATE'
const ADD_LONG_POSITION = 'ADD_LONG_POSITION'
const REMOVE_LONG_POSITION = 'REMOVE_LONG_POSITION'
const REMOVE_ALL_LONGS = 'REMOVE_ALL_LONGS'

export const addLongToList = (theObject, thePrice, theQuantity, theAccount) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  let theObjectArray = [theObject]
  return {
    type: ADD_LONG_POSITION,
    theObject: theObjectArray,
    theDate: theDate,
    theEvent: 'entered',
    thePrice: thePrice,
    theQuantity: theQuantity,
    theAccount: theAccount,
  }
}

// NOTE: This object should be moved to results state slice before removing it here
export const removeLongFromList = (symbol) => {
  return {
    type: REMOVE_LONG_POSITION,
    symbol: symbol,
  }
}
export const removeAllLongsFromList = () => {
  return {
    type: REMOVE_ALL_LONGS,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultLongs = cloneDeep(defaultState.longs) //in case state is undefined

export default function longsReducer(state = defaultLongs, action) {
  switch (action.type) {
    case ADD_LONG_POSITION: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultLongExit)
      let newState = reduceTargetState(state, action.theObject, newDashboard, action.theDate, action.theEvent, action.thePrice, action.theQuantity, action.theAccount)
      return newState
    }
    case REMOVE_LONG_POSITION: {
      //filter to keep all except the action.symbol one
      let newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    case REMOVE_ALL_LONGS: {
      return cloneDeep(defaultLongs)
    }
    case RESET_APP_STATE: {
      return cloneDeep(defaultLongs)
    }
    default:
      return state
  }
}
