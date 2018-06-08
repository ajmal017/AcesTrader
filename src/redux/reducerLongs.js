//  redux/reducerLongs.js

import defaultState from '../json/defaultState.json'
// import defaultDashboard from '../json/defaultDashboard.json' //pending use
// import defaultLongExit from '../json/defaultLongExit.json' //pending use
var cloneDeep = require('lodash.clonedeep')

const OPEN_LONG_POSITION = 'acestrader.Longs.OPEN_LONG_POSITION'
const CLOSE_LONG_POSITION = 'acestrader.Longs.CLOSE_LONG_POSITION'

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultLongs = cloneDeep(defaultState.longs) //in case state is undefined

export default function chartsReducer(state = defaultLongs, action) {
  switch (action.type) {
    case OPEN_LONG_POSITION: {
      return { ...state, ...action } //TODO needs logic
    }
    case CLOSE_LONG_POSITION: {
      return state //TODO needs logic
    }
    default:
      return state
  }
}
