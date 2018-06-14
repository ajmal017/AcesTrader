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
