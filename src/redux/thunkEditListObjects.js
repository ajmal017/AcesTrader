// thunkEditListObjects.js

import getFillPrice from '../lib/apiGetFillPrice'
var cloneDeep = require('lodash.clonedeep')

export const REPLACE_LIST_OBJECT = 'REPLACE_LIST_OBJECT'

function replaceListObject(theObject) {
  return {
    type: REPLACE_LIST_OBJECT,
    theObject: theObject,
  }
}

export const addFilledPriceAsync = (hash) => {
  return (dispatch, getState) => {
    let ourState = getState() //to  search the positions and results lists
    let foundObject = ourState.longs.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.shorts.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.trendlongs.find((obj) => obj.hash === hash)
    if (!foundObject) foundObject = ourState.results.find((obj) => obj.hash === hash)
    if (!foundObject) {
      alert('No foundObject in "addFilledPriceAsync"')
      debugger
    }

    let newObject = cloneDeep(foundObject)
    getFillPrice(newObject.symbol)
      .then(function(data) {
        newObject['enteredPrice'] = data
        dispatch(replaceListObject(newObject))
      })
      .catch(function(error) {
        console.log('getFillPrice axios error:', error.message)
        alert('getFillPrice axios error: ' + error.message) //rude interruption to user
      })
  }
}
