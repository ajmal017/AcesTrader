// redux/reducerTrendBuys.js
// Prospective trend following stocks watching for buy signal

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultTrendEntry from '../json/defaultTrendEntry.json'
import reduceTargetState from './reduceTargetState.js'
var cloneDeep = require('lodash.clonedeep')

const ADD_TREND_BUYS = 'ADD_TREND_BUYS'
const REMOVE_ONE_TREND_BUY = 'REMOVE_ONE_TREND_BUY'
const REMOVE_ALL_TREND_BUYS = 'REMOVE_ALL_TREND_BUYS'

export const addTrendBuysToList = (trendbuysList) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_TREND_BUYS,
    trendbuysArray: trendbuysList,
    theDate: theDate,
  }
}
export const removeTrendBuyFromList = (trendbuyName) => {
  return {
    type: REMOVE_ONE_TREND_BUY,
    symbol: trendbuyName,
  }
}
export const removeAllTrendBuysFromList = () => {
  return {
    type: REMOVE_ALL_TREND_BUYS,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultTrendBuys = cloneDeep(defaultState.trendbuys) //in case state is undefined

export default function trendbuysReducer(state = defaultTrendBuys, action) {
  switch (action.type) {
    case ADD_TREND_BUYS: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultTrendEntry)
      let newState = reduceTargetState(state, action.buysArray, newDashboard, action.theDate)
      return newState
    }
    case REMOVE_ONE_TREND_BUY: {
      //filter to keep all except the action.symbol one
      let newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    case REMOVE_ALL_TREND_BUYS: {
      return cloneDeep(defaultTrendBuys)
    }
    default:
      return state
  }



