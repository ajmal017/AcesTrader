//  redux/reducerBuys.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongEntry from '../json/defaultLongEntry.json'
import reduceProspects from './reduceProspects.js'
var cloneDeep = require('lodash.clonedeep')

const ADD_BUYS = 'ADD_BUYS'
const REMOVE_ONE_BUY = 'REMOVE_ONE_BUY'
const REMOVE_ALL_BUYS = 'REMOVE_ALL_BUYS'

export const addBuystoList = (buysList) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_BUYS,
    buysArray: buysList,
    theDate: theDate,
  }
}
export const removeBuyFromList = (buyName) => {
  return {
    type: REMOVE_ONE_BUY,
    symbol: buyName,
  }
}
export const removeAllBuysFromList = () => {
  return {
    type: REMOVE_ALL_BUYS,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultBuys = cloneDeep(defaultState.buys) //in case state is undefined

export default function buysReducer(state = defaultBuys, action) {
  switch (action.type) {
    case ADD_BUYS: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultLongEntry)
      let newState = reduceProspects(state, action.buysArray, newDashboard, action.theDate)
      return newState
    }
    case REMOVE_ONE_BUY: {
      //filter to keep all except the action.symbol one
      let newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    case REMOVE_ALL_BUYS: {
      return cloneDeep(defaultBuys)
    }
    default:
      return state
  }
}
