// redux/reducerShorts.js

import defaultState from '../json/defaultState.json'
// import defaultDashboard from '../json/defaultDashboard.json' //pending use
// import defaultShortExit from '../json/defaultShortExit.json' //pending use
var cloneDeep = require('lodash.clonedeep')

const OPEN_SHORT_POSITION = 'acestrader.shorts.OPEN_SHORT_POSITION'
const CLOSE_SHORT_POSITION = 'acestrader.shorts.CLOSE_SHORT_POSITION'

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultShorts = cloneDeep(defaultState.shorts) //in case state is undefined

export default function chartsReducer(state = defaultShorts, action) {
  switch (action.type) {
    case OPEN_SHORT_POSITION: {
      return { ...state, ...action } //TODO needs logic
    }
    case CLOSE_SHORT_POSITION: {
      return state //TODO needs logic
    }
    default:
      return state
  }
}
