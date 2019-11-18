// redux/index.js

import React from 'react'
import { combineReducers } from 'redux'
import buysReducer from './reducerBuys'
import sellsReducer from './reducerSells'
import longsReducer from './reducerLongs'
import shortsReducer from './reducerShorts'
import trendbuysReducer from './reducerTrendBuys'
import trendlongsReducer from './reducerTrendLongs'
import resultsReducer from './reducerResults'
import normalpricedataReducer from './reducerNormalPriceData'
import sandboxpricedataReducer from './reducerSandboxPriceData'
import modalReducer from './reducerModal'

export const AuthenticatedContext = React.createContext(false)

const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE'
const UPDATE_DASHBOARD_PEEK_DATA = 'UPDATE_DASHBOARD_PEEK_DATA'

// this action type is handled in all the reducers except results & modalReducer
export const updateDashboardPeekData = (peekPricesObject) => {
  let date = new Date()
  let theDate = date.toLocaleString('en-US').toLowerCase()
  // Extract the parts we want from a local string like: "11/21/2018, 4:49:28 pm"
  // and build a string like: "11/21/18, 4:49 pm" with a 2 digit year and no seconds
  let result = /(.*\/.*\/)\d\d(.*:\d{1,2}):\d{1,2}(.*)/.exec(theDate)
  theDate = result[1] + result[2] + result[3]

  return {
    type: UPDATE_DASHBOARD_PEEK_DATA,
    peekdataobject: peekPricesObject,
    theDate: theDate,
  }
}
// this action type is handled in all the reducers except modalReducer
export const resetDefaultState = () => {
  return {
    type: RESET_DEFAULT_STATE,
  }
}
// this action type is handled in all the reducers including modalReducer
// this is to trigger a refresh of connect's mapStateToProps in all components
export const resetPersistedState = (persistedState) => {
  return {
    type: RESET_PERSISTED_STATE,
    persistedState: persistedState,
  }
}

const rootReducer = combineReducers({
  buys: buysReducer,
  longs: longsReducer,
  sells: sellsReducer,
  shorts: shortsReducer,
  trendbuys: trendbuysReducer,
  trendlongs: trendlongsReducer,
  results: resultsReducer,
  normalpricedata: normalpricedataReducer,
  sandboxpricedata: sandboxpricedataReducer,
  modal: modalReducer,
})

export default rootReducer
