// thunkEditListObjects.js

import getFillPrice from '../lib/apiGetFillPrice'
var cloneDeep = require('lodash.clonedeep')

export const REPLACE_POSITION_OBJECT = 'REPLACE_POSITION_OBJECT'
export const REPLACE_RESULTS_OBJECT = 'REPLACE_RESULTS_OBJECT'

export const addExitPriceAsync = (hash) => {
  return (dispatch, getState) => {
    let ourState = getState() //to  search the results lists
    let foundObject = ourState.results.find((obj) => obj.hash === hash)
    if (!foundObject) {
      alert('No found results Object in "addExitPriceAsync"')
      debugger //stop for developer
    }
    let newObject = cloneDeep(foundObject)
    getFillPrice(newObject.symbol)
      .then(function(data) {
        if (TypeError) {
          newObject['exitedPrice'] = 'Not Available'
        } else {
          newObject['exitedPrice'] = data //the filled price for this order
        }
        dispatch(replaceTradeObject(newObject))
      })
      .catch(function(error) {
        console.log('getFillPrice axios error:', error.message)
        alert('getFillPrice axios error: ' + error.message) //rude interruption to user
      })
  }
}

function replaceTradeObject(theObject) {
  return {
    type: REPLACE_RESULTS_OBJECT,
    theObject: theObject,
  }
}

export const addEnterPriceAsync = (hash) => {
  return (dispatch, getState) => {
    let ourState = getState() //to  search the 3 positions lists
    let foundObject = ourState.longs.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.shorts.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.trendlongs.find((obj) => obj.hash === hash)
    if (!foundObject) {
      alert('No foundObject in "addEnterPriceAsync"')
      debugger //stop for developer
    }
    let newObject = cloneDeep(foundObject)
    getFillPrice(newObject.symbol)
      .then(function(data) {
        var data = +data // cast to a number to test validity:
        if (isNaN(data)) {
          newObject['enteredPrice'] = 'Not Available'
        } else {
          newObject['enteredPrice'] = data //the filled price for this order
        }
        newObject['filledquantity'] = null //removes wrongly labeled property
        newObject['filledQuantity'] = newObject['enterQuantity'] //assumption - can be changed by later query to Ameritrade
        dispatch(replaceListObject(newObject))
      })
      .catch(function(error) {
        console.log('getFillPrice axios error:', error.message)
        alert('getFillPrice axios error: ' + error.message) //rude interruption to user
      })
  }
}
function replaceListObject(theObject) {
  return {
    type: REPLACE_POSITION_OBJECT,
    theObject: theObject,
  }
}
