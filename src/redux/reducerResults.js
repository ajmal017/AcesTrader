// redux/reducerResults.js

import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const RESET_APP_STATE = 'RESET_APP_STATE'
const ADD_RESULT = 'ADD_RESULT'
const REMOVE_RESULT = 'REMOVE_RESULT'
const REMOVE_ALL_RESULTS = 'REMOVE_ALL_RESULTS'

export const addResultToList = (theObject, thePrice) => {
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return {
    type: ADD_RESULT,
    theObject: theObject,
    theDate: theDate,
    theEvent: 'exited',
    thePrice: thePrice,
  }
}

// NOTE: This object is lost from state after removing it here
export const removeResultFromList = (hash) => {
  return {
    type: REMOVE_RESULT,
    hash: hash,
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
      action.theObject.exitedPrice = action.thePrice
      let theObjectArray = [action.theObject]
      let newState = theObjectArray.concat(state) //adds at start
      return newState
    }
    case REMOVE_RESULT: {
      // filter to keep all except the one with the same
      // action.symbol and a matching exited date
      let newState = state.filter((obj) => obj.hash !== action.hash)
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
