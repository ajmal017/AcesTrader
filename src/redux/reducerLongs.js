//  redux/reducerLongs.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongExit from '../json/defaultLongExit.json'
var cloneDeep = require('lodash.clonedeep')

const ADD_LONG_POSITION = 'ADD_LONG_POSITION'
const REMOVE_LONG_POSITION = 'REMOVE_LONG_POSITION'

export const addLongToList = (theObject) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_LONG_POSITION,
    theObject: theObject,
    theDate: theDate,
    theEvent: 'entered',
  }
}

// NOTE: This object should be moved to results state slice before removing it here
export const removeLongFromList = (symbol) => {
  return {
    type: REMOVE_LONG_POSITION,
    symbol: symbol,
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
      let newState = reduceTargetState(state, action.theObject, newDashboard, action.theDate, action.theEvent)
      return newState
    }
    case REMOVE_LONG_POSITION: {
      //filter to keep all except the action.symbol one
      let newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    default:
      return state
  }
}
