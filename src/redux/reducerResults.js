// redux/reducerResults.js

import defaultState from '../json/defaultState.json'
import { REPLACE_RESULTS_OBJECT } from './thunkEditListObjects.js'
var cloneDeep = require('lodash.clonedeep')

const RESET_DEFAULT_STATE = 'RESET_DEFAULT_STATE'
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

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultResults = cloneDeep(defaultState.results) //in case state is undefined

export default function chartsReducer(state = defaultResults, action) {
  switch (action.type) {
    case RESET_PERSISTED_STATE: {
      if (action.persistedState.results) {
        return cloneDeep(action.persistedState.results) //reset this state's slice to the persisted value
      }
      return cloneDeep(defaultResults)
    }
    case ADD_RESULT: {
      let theObject = cloneDeep(action.theObject)
      theObject.exited = action.theDate
      theObject.exitedPrice = action.thePrice
      theObject.listGroup = 'trades'
      let newState = cloneDeep(state)
      newState.push(theObject) // put theObject ahead of older objects
      return newState
    }
    case REMOVE_RESULT: {
      // filter to keep all except the one with the same
      // action.symbol and a matching exited date
      let newState = state.filter((obj) => obj.hash !== action.hash)
      return newState
    }
    case REPLACE_RESULTS_OBJECT: {
      let hash = action.theObject.hash
      let foundObject = state.find((obj) => obj.hash === hash)
      if (!foundObject) {
        return state //target object is not in this list
      }
      let prunedState = state.filter((obj) => obj.hash !== hash) //remove the old object versiom
      let newState = cloneDeep(prunedState)
      newState.unshift(action.theObject) //add the new trade to front of the list
      return newState
    }
    case REMOVE_ALL_RESULTS: {
      return cloneDeep(defaultResults)
    }
    case RESET_DEFAULT_STATE: {
      return cloneDeep(defaultResults)
    }
    default:
      return state
  }
}
