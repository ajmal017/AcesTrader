// redux/reducerShorts.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultShortExit from '../json/defaultShortExit.json'
var cloneDeep = require('lodash.clonedeep')

const ADD_SHORT_POSITION = 'ADD_SHORT_POSITION'
const REMOVE_SHORT_POSITION = 'REMOVE_SHORT_POSITION'

export const addShortToList = (theObject) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_SHORT_POSITION,
    theObject: theObject,
    theDate: theDate,
    theEvent: 'entered',
  }
}

// NOTE: This object should be moved to results state slice before removing it here
export const removeShortFromList = (symbol) => {
  return {
    type: REMOVE_SHORT_POSITION,
    symbol: symbol,
  }
}
export const removeAllShortsFromList = () => {
  return {
    type: REMOVE_ALL_SHORTS,
  }
}
// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultShorts = cloneDeep(defaultState.shorts) //in case state is undefined

export default function chartsReducer(state = defaultShorts, action) {
  switch (action.type) {
    case ADD_SHORT_POSITION: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultShortExit)
      let newState = reduceTargetState(state, action.theObject, newDashboard, action.theDate, action.theEvent)
      return newState
    }
    case REMOVE_SHORT_POSITION: {
      //filter to keep all except the action.symbol one
      let newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    case REMOVE_ALL_SHORTS: {
      return cloneDeep(defaultShorts)
    }
    default:
      return state
  }
}
