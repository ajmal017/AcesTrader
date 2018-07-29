// redux/reducerResults.js

import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const RESET_APP_STATE = 'RESET_APP_STATE'
const ADD_RESULT = 'ADD_RESUL'
const REMOVE_RESULT = 'REMOVE_RESULT'
const REMOVE_ALL_RESULTS = 'REMOVE_ALL_RESULTS'

export const addResultToList = (theObject) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_RESULT,
    theObject: theObject,
    theDate: theDate,
    theEvent: 'exited',
  }
}

// NOTE: This object is lost after removing it here
export const removeResultFromList = (symbol) => {
  return {
    type: REMOVE_RESULT,
    symbol: symbol,
  }
}
export const removeAllResultsFromList = () => {
  return {
    type: REMOVE_ALL_RESULTS,
  }
}
// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultResults = cloneDeep(defaultState.results) //in case state is undefined

export default function chartsReducer(state = defaultResults, action) {
  switch (action.type) {
    case ADD_RESULT: {
      action.theObject.exited = action.theDate
      // action.theObject.exitedPrice = ???
      let newState = state.concat(action.theObject)
      return newState
    }
    case REMOVE_RESULT: {
      //filter to keep all except the action.symbol one
      let newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    case REMOVE_ALL_RESULTS: {
      return cloneDeep(defaultResults)
    }
    case RESET_APP_STATE: {
      return cloneDeep(defaultResults)
    }
    default:
      return state
  }
}
