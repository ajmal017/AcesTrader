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
      .then(function(data11) {
        let data1 = +data11 // cast to a number to test validity:
        if (isNaN(data1)) {
          newObject['exitedPrice'] = 'Not Available'
        } else {
          newObject['exitedPrice'] = data1 //the filled price for this order
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
//AndQuantity
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
      .then(function(data22) {
        let data2 = +data22 // cast to a number to test validity:
        if (isNaN(data2)) {
          newObject['enteredPrice'] = 'Not Available'
        } else {
          newObject['enteredPrice'] = data2 //the filled price for this order
          if (foundObject.quantityType === 'DOLLARS') {
            //calc the filled quantity
            var quantity = newObject['filledQuantity'] / data2
            newObject['filledQuantity'] = isNaN(quantity) ? 'Not Known' : Math.floor(quantity)
          } else {
            newObject['filledQuantity'] = newObject['filledQuantity'] //as ordered
          }
        }
        newObject['filledquantity'] = null //removes wrongly labeled property if it still exists
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
