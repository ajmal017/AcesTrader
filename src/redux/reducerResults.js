// redux/reducerResults.js

import defaultState from '../json/defaultState.json'
import { REPLACE_EDITED_OBJECT } from './thunkEditListObjects.js'
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

const findIndexOfObject = (state, hash) => {
  let foundIndex = null
  let foundObject = state.find((obj, index) => {
    if (obj.hash === hash) {
      foundIndex = index // use this to replace the object
      return true
    }
    return false
  })
  if (!foundObject) {
    // should not happen in this particular reducer
    alert('target result object is not in the results list')
    debugger // for developer
  }
  return foundIndex
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
      // if (state.length > 0) {
      //   theObject.carried = state[0].adjusted //get value from the latest object in current chain
      // } else {
      //   theObject.carried = 0 //first trade starts with zero portfolio value until edited by user
      // }
      let newState = cloneDeep(state)
      newState.unshift(theObject) // put theObject ahead of older objects
      return newState
    }
    case REMOVE_RESULT: {
      // let foundIndex = findIndexOfObject(state, action.hash)
      // if (foundIndex === state.length-1) { //removing the last in chain, the earliest one, with the anchor value
      //   state[foundIndex - 1].carried = state[foundIndex].adjusted //correct the anchor value in resulting chain
      //   // we are removing the anchor link in chain, so correct the carried value in new anchor link
      // }
      /**
       * Note to self. Does the above code really matter? I don't think so, and the code is commented out.
       * When displaying the Results page, all these links are dynamically determined
       * and the carried values and adjusted values are calculated again.
       * So the only value that is important is the carried value in the oldest linked object at index=state.length-1,
       * and this will be available in the remaining last object in the new array if any calculations have been done.
       * If no calculations, then the value will be undefined and will default to zero, and can be edited by the user.
       */
      // filter to keep all except the one with the hash
      let newState = state.filter((obj) => obj.hash !== action.hash)
      return newState
    }
    case REPLACE_EDITED_OBJECT: {
      // note: the reducer logic for Results is different than the others,
      // which replace using alphabetical sorting. The results placed in
      // the Trades state are in chronological sequence, so we use
      // the found index to replace the object at that location.

      // let hash = action.theObject.hash
      // let foundIndex = null
      // let foundObject = state.find((obj, index) => {
      //   if (obj.hash === hash) {
      //     foundIndex = index // use this to replace the object
      //     return true
      //   }
      // })
      // if (!foundObject) {
      //   // should not happen in this particular reducer
      //   alert('target result object is not in the results list')
      //   debugger // for developer
      //   return state //target object is not in this list
      // }

      let foundIndex = findIndexOfObject(state, action.theObject.hash)
      // Replace the object in the same chronological order in the newState array
      let newState = cloneDeep(state) // start with the current array to have the object replaced
      newState[foundIndex] = action.theObject
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
