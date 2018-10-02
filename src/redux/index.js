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

const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE'
const UPDATE_DASHBOARD_PEEK_DATA = 'UPDATE_DASHBOARD_PEEK_DATA'

// this action type is handled in all the reducers except results & modalReducer
export const updateDashboardPeekData = (peekdataobject) => {
  let date = new Date()
  let theDate = date.toLocaleString('en-US').toLowerCase()
  return {
    type: UPDATE_DASHBOARD_PEEK_DATA,
    peekdataobject: peekdataobject,
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
  sells: sellsReducer,
  longs: longsReducer,
  shorts: shortsReducer,
  trendbuys: trendbuysReducer,
  trendlongs: trendlongsReducer,
  results: resultsReducer,
  modal: modalReducer,
})

export default rootReducer
