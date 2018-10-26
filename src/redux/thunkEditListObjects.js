// thunkEditListObjects.js

import { getWatchedPrice, resetWatchedPrices } from '../lib/appWatchedPrice'
import getFillPrice from '../lib/apiGetFillPrice'
import { getSymbolDataObject } from '../lib/appSymbolDataObject'
var cloneDeep = require('lodash.clonedeep')

export const REPLACE_RESULTS_OBJECT = 'REPLACE_RESULTS_OBJECT'
export const REPLACE_POSITION_OBJECT = 'REPLACE_POSITION_OBJECT'
export const REPLACE_PROSPECT_OBJECT = 'REPLACE_PROSPECT_OBJECT'
export const REPLACE_EDITED_OBJECT = 'REPLACE_EDITED_OBJECT'

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
//AddQuantity by calculation using the entered price
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
            //calculate the filled quantity
            var quantity = newObject['filledQuantity'] / data2
            newObject['filledQuantity'] = isNaN(quantity) ? 'Not Known' : Math.floor(quantity)
          } else {
            // newObject['filledQuantity'] = newObject['filledQuantity'] //quantity remains as specified in the order
          }
        }
        newObject['filledquantity'] = null //removes wrongly labeled property if it still exists
        dispatch(replacePositionObject(newObject))
      })
      .catch(function(error) {
        console.log('getFillPrice axios error:', error.message)
        alert('getFillPrice axios error: ' + error.message) //rude interruption to user
      })
  }
}
function replacePositionObject(theObject) {
  return {
    type: REPLACE_POSITION_OBJECT,
    theObject: theObject,
  }
}

export const addWatchPriceAsync = (tradeSide) => {
  return (dispatch, getState) => {
    let ourState = getState() //to  search the 3 prospects lists
    //Since the caller of this thunk does not know the hash tags,
    //which were added after as part of the reducer function,
    //we have to create a list of objects without the watchedPrice,
    //they are the ones just added by the ManageProspects component.
    let prospectsObjArray
    if (tradeSide === 'SWING BUYS') {
      prospectsObjArray = ourState.buys.filter((obj) => obj.watchedPrice === undefined)
    }
    if (tradeSide === 'SWING SELLS') {
      prospectsObjArray = ourState.sells.filter((obj) => obj.watchedPrice === undefined)
    }
    if (tradeSide === 'TREND BUYS') {
      prospectsObjArray = ourState.trendbuys.filter((obj) => obj.watchedPrice === undefined)
    }
    for (let ii = 0; ii < prospectsObjArray.length; ii++) {
      //for each of the newly added prospect list objects
      let foundObject = prospectsObjArray[ii]
      let newObject = cloneDeep(foundObject)
      // Add the watched price
      let price = getWatchedPrice(newObject.symbol) //peek prices were loaded in the ManageProspects component when symbols were submitted
      if (isNaN(price)) {
        newObject['watchedPrice'] = 'Not Available'
      } else {
        newObject['watchedPrice'] = price //the price when this symbol was added to the prospects' watch list
      }
      // Add the IEX security issueType code
      let DataObject = getSymbolDataObject(newObject.symbol)
      newObject['issueType'] = DataObject.issueType

      dispatch(replaceProspectObject(newObject))
    }
    resetWatchedPrices()
    //*************** resetSymbolDataObjects()
  }
}

function replaceProspectObject(theObject) {
  return {
    type: REPLACE_PROSPECT_OBJECT,
    theObject: theObject,
  }
}

export const editDashboardPrarmetersAsync = (hash, parameterData) => {
  return (dispatch, getState) => {
    let ourState = getState() //to  search the list for the target object
    let foundObject = ourState.longs.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.shorts.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.trendlongs.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.buys.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.sells.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.trendbuys.find((obj) => obj.hash === hash)
    if (!foundObject) {
      alert('No foundObject in "editDashboardPrarmetersAsync"')
      debugger //stop for developer
    }
    let newObject = cloneDeep(foundObject)
    // the parameterData is an object with key/value pairs for each form field: {name: value, name: value, ...}
    for (let key in parameterData) {
      if (key === 'watched' || key === 'watchedPrice' || key === 'entered' || key === 'enteredPrice' || key === 'filledQuantity') {
        newObject[key] = parameterData[key]
      } else {
        newObject.dashboard[key] = parameterData[key]
      }
    }
    dispatch(replaceEditedObject(newObject))
  }
}
function replaceEditedObject(theObject) {
  return {
    type: REPLACE_EDITED_OBJECT,
    theObject: theObject,
  }
}
