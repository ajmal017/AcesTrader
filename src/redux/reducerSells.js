// redux/reducerSells.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultShortEntry from '../json/defaultShortEntry.json'
import reduceTargetState from './reduceTargetState.js'
var cloneDeep = require('lodash.clonedeep')

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
export const removeSellFromList = (symbol) => {
  return {
    type: REMOVE_ONE_SELL,
    symbol: symbol,
  }
}
export const removeAllSellsFromList = () => {
  return {
    type: REMOVE_ALL_SELLS,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultSells = cloneDeep(defaultState.sells) //in case state is undefined

export default function sellsReducer(state = defaultSells, action) {
  switch (action.type) {
    case ADD_SELLS: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultShortEntry)
      let newState = reduceTargetState(state, action.sellsArray, newDashboard, action.theDate, action.theEvent)
      return newState
    }
    case REMOVE_ONE_SELL: {
      let newState = cloneDeep(defaultSells)
      //filter all except the action.symbol one
      newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    case REMOVE_ALL_SELLS: {
      return cloneDeep(defaultSells)
    }
    default:
      return state
  }
}
