// reducerNormalPriceData.js

import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"
const REPLACE_NORMAL_PRICEDATA = 'REPLACE_NORMAL_PRICEDATA'
const REMOVE_NORMAL_PRICEDATA = 'REMOVE_NORMAL_PRICEDATA'

export const replaceNormalPricedata = (pricedata) => {
  return {
    type: REPLACE_NORMAL_PRICEDATA,
    pricedata: pricedata,
  }
}
export const removeNormalPricedata = () => {
  return {
    type: REMOVE_NORMAL_PRICEDATA,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultNormalPricedata = cloneDeep(defaultState.normalpricedata) //in case state is undefined

export default function normalpricedataReducer(state = defaultNormalPricedata, action) {
  // state: The pricedata object whose properties are key/value pairs, each pair being "symbol/array" where array contains daily price objects
  switch (action.type) {
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.normalpricedata) {
        return cloneDeep(action.persistedState.normalpricedata) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultNormalPricedata)
    }
    case REPLACE_NORMAL_PRICEDATA: {
      if (action.pricedata) {
        let newState = cloneDeep(state) // start with the current object to have the object replaced
        newState = action.pricedata
        return newState //reset this state's slice to the modified value
      }
      return state
    }
    case REMOVE_NORMAL_PRICEDATA: {
      return cloneDeep(defaultNormalPricedata)
    }
    default:
      return state
  }
}
