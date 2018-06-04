//  redux/reducerBuys.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongEntry from '../json/defaultLongEntry.json'
var cloneDeep = require('lodash.clonedeep')

const ADD_BUYS = 'ADD_BUYS'
const REMOVE_ONE_BUY = 'REMOVE_ONE_BUY'
const REMOVE_ALL_BUYS = 'REMOVE_ALL_BUYS'

export const addBuystoList = (buysList) => {
  return {
    type: ADD_BUYS,
    buysArray: buysList,
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
      let newState = cloneDeep(state)
      // let newDashboard = cloneDeep(defaultDashboard)
      // let newLongEntry = cloneDeep(defaultLongEntry)
      let newDashboard = Object.assign({}, defaultDashboard, defaultLongEntry)
      let newBuys = action.buysArray.map((sym) => {
        //prune newBuys array of dup symbols
        state.map((obj) => {
          if (obj.symbol === sym) return null //found dup symbol, don't add another
        })
        //unique symbol so add the object
        return {
          symbol: sym,
          dashboard: newDashboard,
        }
      })
      // concate newBuys onto newState
      return newState.concat(newBuys)
    }
    case REMOVE_ONE_BUY: {
      let newState = cloneDeep(defaultBuys)
      newState = state.filter((obj) => {
        obj.symbol !== action.symbol
      })
      return newState
    }
    case REMOVE_ALL_BUYS: {
      return cloneDeep(defaultBuys)
    }
    default:
      return state
  }
}
