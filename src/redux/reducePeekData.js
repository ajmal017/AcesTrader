// reducePeekData.js

import defaultDashboard from '../json/defaultDashboard.json'
import defaultLongEntry from '../json/defaultLongEntry.json'
import defaultLongExit from '../json/defaultLongExit.json'
import defaultShortEntry from '../json/defaultShortEntry.json'
import defaultShortExit from '../json/defaultShortExit.json'
import { getLast20Closes } from '../lib/chartDataCache'
import { getHighestLowestCloses } from '../lib/appGetHighestLowestCloses'

var cloneDeep = require('lodash.clonedeep')

/**
 * This reducer is called by every one of the combineReducers, so every list object in the Store is seen.
 *
 * Parameters:
 * state: A slice of the state as defined by combineReducers, the current source array of objects
 * theDate: A formatted date and time string
 *
 * This function is called to referrence the peek data captured when the user selected the More/Peek menue.
 * The data and time is supplied as an input parameter.
 * A slice of the app's state is supplied also.
 * Using the array.map method, each list object in the state is accessed to get it's symbol,
 * and the symbol is used to get the peeked price.
 * The price is used to updated the peekPrice property in the list object,
 * and to adjust the trailingStopBasis price if required.
 */

export default function(state, peekPricesObject, theDate) {
  // Parameters:
  // state: A slice of the state as defined by combineReducers, the current target array of objects
  // theDate: A formatted date and time string
  let updated = false // default result
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
    // tradeSide==='Trend Longs' do not get a new dashboard
    if (newDashboard !== undefined) {
      obj.dashboard = newDashboard
      updated = true
    }
    /**
     * End of the special operation
     */

    /**
     * Another special operation to update existing 'quantity' values
     */
    if (obj.dashboard.quantity === 'ALL SHARES' || obj.dashboard.quantity === 'ALL_SHARES') {
      obj.dashboard.quantity = 'ALL'
      updated = true
    }
    /**
     * End of another special operation
     */

    let symbol = obj.symbol

    // After a peek, the peekPricesObject is loaded with a key/value pair for every symbol in the app's state.
    // The peekPricesObject holding those symbol/price pairs is queried with the symbol to get the price at the tilme of the peek.
    // // let peekPricesArray = Object.keys(peekPricesObject)
    if (peekPricesObject && Object.keys(peekPricesObject).length > 0) {
      let lastPrice = peekPricesObject[symbol]
      obj['peekDate'] = theDate
      obj['peekPrice'] = lastPrice
      updated = true
    }

    // Adjust the trailingStopBasis if the closing price is further to the gain side
    const last20Closes = getLast20Closes(symbol)
    if (last20Closes && last20Closes.length > 0) {
      const highestLowestCloses = getHighestLowestCloses(last20Closes, obj.entered) // returns {highest: price, lowest: price}
      if (obj.dashboard.tradeSide === 'Shorts' && obj.trailingStopBasis > highestLowestCloses.lowest) {
        obj.trailingStopBasis = highestLowestCloses.lowest
        updated = true
      } else if (obj.dashboard.tradeSide !== 'Shorts' && obj.trailingStopBasis < highestLowestCloses.highest) {
        obj.trailingStopBasis = highestLowestCloses.highest
        updated = true
      }
    }
    if (obj.trailingStopBasis === undefined && !isNaN(obj.enteredPrice)) {
      obj.trailingStopBasis = obj.enteredPrice
      updated = true
    }
    return obj // add to the newState array with updated properties
  })
  //console.log(JSON.stringify(newState, null, 2)) // a readable log of the object's json
  return updated ? newState : state
}
