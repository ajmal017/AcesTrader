// redux/reducerTrendLongs.js
// Opened long positions of trend follower stocks

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultTrendExit from '../json/defaultTrendExit.json'
var cloneDeep = require('lodash.clonedeep')

const ADD_TREND_LONG_POSITION = 'ADD_TREND_LONG_POSITION'
const REMOVE_TREND_LONG_POSITION = 'CLOSE_TREND_LONG_POSITION'

export const addTrendLongToList = (theObject) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_TREND_LONG_POSITION,
    theObject: theObject,
    theDate: theDate,
    theEvent: 'entered',
  }
}

// NOTE: This object should be moved to results state slice before removing it here
export const removeTrendLongFromList = (symbol) => {
  return {
    type: REMOVE_TREND_LONG_POSITION,
    symbol: symbol,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultTrendLongs = cloneDeep(defaultState.trendlongs) //in case state is undefined

export default function trendlongsReducer(state = defaultTrendLongs, action) {
  switch (action.type) {
    case ADD_TREND_LONG_POSITION: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultTrendExit)
      let newState = reduceTargetState(state, action.theObject, newDashboard, action.theDate, action.theEvent)
      return newState
    }
    case REMOVE_TREND_LONG_POSITION: {
      //filter to keep all except the action.symbol one
      let newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    default:
      return state
  }
}
