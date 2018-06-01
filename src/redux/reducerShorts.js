// redux/reducerShorts.js

import defaultState from '../json/defaultState.json'
import defaultShortExit from '../json/defaultShortExit.json'
var cloneDeep = require('lodash.clonedeep')

const OPEN_SHORT_POSITION = 'acestrader.shorts.OPEN_SHORT_POSITION'
const CLOSE_SHORT_POSITION = 'acestrader.shorts.CLOSE_SHORT_POSITION'

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultShorts = cloneDeep(defaultState.shorts) //in case state is undefined
const defaultExitShorts = cloneDeep(defaultShortExit) //in case state is undefined

export default function chartsReducer(state = defaultState, action) {
  switch (action.type) {
    case OPEN_SHORT_POSITION: {
      return { ...state, ...action } //add the new position
    }
    default:
      return state
  }
}
