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
const MAKE_NEW_STATE_COPY = 'MAKE_NEW_STATE_COPY'

// this action type is handled in all the reducers except modalReducer
export const resetAppState = () => {
  return {
    type: RESET_APP_STATE,
  }
}
// this action type is handled in all the reducers including modalReducer
// this is to trigger a refresh of connect's mapStateToProps in all components
export const makeNewStateCopy = () => {
  return {
    type: MAKE_NEW_STATE_COPY,
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
