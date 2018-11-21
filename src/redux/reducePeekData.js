// reducePeekData.js

import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongEntry from '../json/defaultLongEntry.json'
import defaultLongExit from '../json/defaultLongExit.json'
import defaultShortEntry from '../json/defaultShortEntry.json'
import defaultShortExit from '../json/defaultShortExit.json'

var cloneDeep = require('lodash.clonedeep')

/**
 * This reducer is called by every one of the combineReducers, so every list object in the Store is seen.
 *
 * Parameters:
 * state: A slice of the state as defined by combineReducers, the current source array of objects
 * peekdataobject: An object with key/values for symbols and last price
 * theDate: A formatted date and time string
 *
 * This function is called to referrence the peek data captured when the user selected the More/Peek menue.
 * The peekdataobject at that time is loaded with a key/value pair for every symbol in the app's state.
 * The peekdataobject holding those symbol/price pairs is queried with the symbol to get the price at the tilme of the peek.
 * The data and time is supplied as another input parameter.
 * A slice of the app's state is supplied also.
 * Using the array.map method, each list object in the state is accessed to get it's symbol,
 * and the symbol is used to get the peeked price.
 * The price is used to updated the peekPrice property in the list object,
 * and to adjust the trailingStopBasis price as required.
 */

export default function(state, peekdataobject, theDate) {
  // Parameters:
  // state: A slice of the state as defined by combineReducers, the current target array of objects
  // peekdataobject: An object with key/values for symbols and last price
  // theDate: A formatted date and time string
  let copyState = cloneDeep(state)
  let newState = copyState.map((obj) => {
    /**
     * Perform a special operation to update each old format obj with the latest default dashboard
     * This means that any changes that have been edited in any of the existing ones are lost, and must be repeated.
     */
    let newDashboard
    if (obj.dashboard.tradeSide === 'Swing Buys') {
      newDashboard = Object.assign({}, defaultDashboard, defaultLongEntry)
    }
    if (obj.dashboard.tradeSide === 'Swing Sells') {
      newDashboard = Object.assign({}, defaultDashboard, defaultShortEntry)
    }
    if (obj.dashboard.tradeSide === 'Swing Short Sales') {
      newDashboard = Object.assign({}, defaultDashboard, defaultShortEntry)
    }
    if (obj.dashboard.tradeSide === 'Swing Longs') {
      newDashboard = Object.assign({}, defaultDashboard, defaultLongExit)
    }
    if (obj.dashboard.tradeSide === 'Swing Shorts') {
      newDashboard = Object.assign({}, defaultDashboard, defaultShortExit)
    }
    if (obj.dashboard.tradeSide === 'Swing Short') {
      newDashboard = Object.assign({}, defaultDashboard, defaultShortExit)
    }
    if (newDashboard !== undefined) {
      // tradeSide==='Trend Longs' do not get a new dashboard
      obj.dashboard = newDashboard
    }
    /**
     * End of the special operation
     */

    let symbol = obj.symbol
    let lastPrice = peekdataobject[symbol]
    obj['peekDate'] = theDate
    obj['peekPrice'] = lastPrice

    const initializeTrailingStopBasis = (obj) => {
      if (obj.trailingStopBasis === undefined && !isNaN(obj.enteredPrice)) {
        obj.trailingStopBasis = obj.enteredPrice
      }
      if (obj.trailingStopBasis === undefined) {
        obj.trailingStopBasis = lastPrice
      }
    }

    // adjust the trailingStopBasis
    if (obj.dashboard.tradeSide === 'Shorts') {
      initializeTrailingStopBasis(obj) // if needed
      if (obj.trailingStopBasis > lastPrice) {
        obj.trailingStopBasis = lastPrice
      }
    } else if (obj.dashboard.tradeSide === 'Longs' || obj.dashboard.tradeSide === 'Trend Longs') {
      initializeTrailingStopBasis(obj) // if needed
      if (obj.trailingStopBasis < lastPrice) {
        obj.trailingStopBasis = lastPrice
      }
    }
    return obj // add to the newState array with updated properties
  })
  //console.log(JSON.stringify(newState, null, 2)) // a readable log of the object's json
  return newState

  // let hh = 0
  // let kk = 0
  // let currentListSymbol = null
  // let currentListHash = null
  // let theInputSymbol = null
  // let theInputHash = null
  // let theInput = [theInputObject] //make an array to be compatible with the copied logic below
  // while (hh < state.length || kk < theInput.length) {
  //   if (hh < state.length) {
  //     currentListSymbol = state[hh].symbol
  //     currentListHash = state[hh].hash
  //   }
  //   if (kk < theInput.length) {
  //     theInputSymbol = theInput[kk].symbol
  //     theInputHash = theInput[kk].hash
  //     theInputObject = theInput[kk]
  //   }
  //   if (hh >= state.length) {
  //     //empty array of objects, no more currentListSymbols
  //     newState.push(theInputObject) //finish the new list objects
  //     ++kk
  //   } else if (kk >= theInput.length) {
  //     //empty list of inputs, no more theInputSymbols
  //     newState.push(state[hh]) //finish the current objects
  //     ++hh
  //   } else if (currentListSymbol < theInputSymbol) {
  //     newState.push(state[hh])
  //     ++hh
  //   } else if (currentListSymbol > theInputSymbol) {
  //     newState.push(theInputObject)
  //     ++kk
  //   } else if (currentListSymbol === theInputSymbol) {
  //     if (currentListHash === theInputHash) {
  //       alert('ERROR in reduceTargetState: Dup hash found for ' + theInputSymbol + ', object not added to list')
  //     } else {
  //       newState.push(theInputObject) // put newest ahead of older object
  //       ++kk
  //     }
  //   }
  // }
}
