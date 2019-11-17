// reducerPriceData.js

import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"
const REPLACE_MODIFIED_PRICEDATA = 'REPLACE_MODIFIED_PRICEDATA'
const REMOVE_ALL_PRICEDATA = 'REMOVE_ALL_PRICEDATA'

export const replaceModifiedPricedata = (priceData) => {
  return {
    type: REPLACE_MODIFIED_PRICEDATA,
    priceData: priceData,
  }
}
export const removeAllPricedata = () => {
  return {
    type: REMOVE_ALL_PRICEDATA,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultPricedata = cloneDeep(defaultState.pricedata) //in case state is undefined

export default function pricedataReducer(state = defaultPricedata, action) {
  // state: The pricedata object whose properties are key/value pairs, each pair being "symbol/array" where array contains daily price objects
  switch (action.type) {
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.pricedata) {
        return cloneDeep(action.persistedState.pricedata) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultPricedata)
    }
    case REPLACE_MODIFIED_PRICEDATA: {
      if (action.state.pricedata) {
        return cloneDeep(action.state.pricedata) //reset this state's slice to the modified value
      }
      return cloneDeep(defaultPricedata)
    }
    case REMOVE_ALL_PRICEDATA: {
      return cloneDeep(defaultPricedata)
    }
    default:
      return state
  }
}
