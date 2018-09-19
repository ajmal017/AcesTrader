// redux/index.js

import { combineReducers } from 'redux'
import buysReducer from './reducerBuys'
import sellsReducer from './reducerSells'
import longsReducer from './reducerLongs'
import shortsReducer from './reducerShorts'
import trendbuysReducer from './reducerTrendBuys'
import trendlongsReducer from './reducerTrendLongs'
import resultsReducer from './reducerResults'
import modalReducer from './reducerModal'

const RESET_APP_STATE = 'RESET_APP_STATE'
const RESET_STATE_FROM_STORAGE = 'RESET_STATE_FROM_STORAGE'

// this action type is handled in all the reducers except modalReducer
export const resetAppState = () => {
  return {
    type: RESET_APP_STATE,
  }
}
// this action type is handled in all the reducers including modalReducer
// this is to trigger a refresh of connect's mapStateToProps in all components
export const resetStateFromStorage = (mySlice, myState) => {
  return {
    type: RESET_STATE_FROM_STORAGE,
    slice: mySlice,
    state: myState,
  }
}

const rootReducer = combineReducers({
  buys: buysReducer,
  sells: sellsReducer,
  longs: longsReducer,
  shorts: shortsReducer,
  trendbuys: trendbuysReducer,
  trendlongs: trendlongsReducer,
  results: resultsReducer,
  modal: modalReducer,
})

export default rootReducer
