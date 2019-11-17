// reducerSandboxPriceData.js

import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"
const REPLACE_SANDBOX_PRICEDATA = 'REPLACE_SANDBOX_PRICEDATA'
const REMOVE_SANDBOX_PRICEDATA = 'REMOVE_SANDBOX_PRICEDATA'

export const replaceSandboxPricedata = (priceData) => {
  return {
    type: REPLACE_SANDBOX_PRICEDATA,
    priceData: priceData,
  }
}
export const removeSandboxPricedata = () => {
  return {
    type: REMOVE_SANDBOX_PRICEDATA,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultSandboxPricedata = cloneDeep(defaultState.sandboxpricedata) //in case state is undefined

export default function sandboxpricedataReducer(state = defaultSandboxPricedata, action) {
  // state: The pricedata object whose properties are key/value pairs, each pair being "symbol/array" where array contains daily price objects
  switch (action.type) {
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.pricedata) {
        return cloneDeep(action.persistedState.pricedata) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultPricedata)
    }
    case REPLACE_SANDBOX_PRICEDATA: {
      if (action.state.pricedata) {
        return cloneDeep(action.state.pricedata) //reset this state's slice to the modified value
      }
      return cloneDeep(defaultSandboxPricedata)
    }
    case REMOVE_SANDBOX_PRICEDATA: {
      return cloneDeep(defaultSandboxPricedata)
    }
    default:
      return state
  }
}
