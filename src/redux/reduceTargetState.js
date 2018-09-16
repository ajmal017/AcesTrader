// reduceTargetState.js

import uuidv4 from 'uuid/v4'

export default function(state, theInput, newDashboard, theDate, theEvent, thePrice = null, theQuantity = null, theQuantityType = null, theAccount = null) {
  // Parameters:
  // state: The current target array of objects, either Prospects or Positions
  // theInput: A list of prospect symbols or watched objects to merge into this target state slice
  // newDashboard: The default dashboard object to be included in the each merged object
  let newState = [] // start with empty array to be populated below with objects
  // Merge the input objects in alphabetical symbol order in the newState array
  let hh = 0
  let kk = 0
  let currentListSymbol = null
  let currentListHash = null
  let theInputSymbol = null
  let theInputHash = null
  let theInputObject = null
  while (hh < state.length || kk < theInput.length) {
    if (hh < state.length) {
      currentListSymbol = state[hh].symbol
      currentListHash = state[hh].hash
    }
    if (kk < theInput.length) {
      switch (theEvent) {
        case 'watched': //theInput is a list of symbols going into Prospects
          theInputSymbol = theInput[kk]
          //create the watched asset object from just the input symbol
          theInputObject = {} // the new object
          theInputObject.symbol = theInputSymbol
          theInputObject.dashboard = newDashboard //includes the order entry parameters
          theInputObject.watched = theDate
          theInputObject.hash = uuidv4() // make for unique object ID, instead of symbol (which may be repeated in Positions & Results)
          theInputHash = theInputObject.hash
          break
        case 'entered': //theInput is a list of asset objects going into Positions
          theInputSymbol = theInput[kk].symbol
          theInputHash = theInput[kk].hash
          theInputObject = theInput[kk]
          //update the entered asset object
          theInputObject.dashboard = newDashboard //includes the order exit parameters
          theInputObject.entered = theDate
          theInputObject.enteredPrice = thePrice
          theInputObject.filledQuantity = theQuantity
          theInputObject.quantityType = theQuantityType //for use in thunkEditListObjects
          theInputObject.account = theAccount
          break
        case 'exited': //theInput is a list of asset objects going into Results
          theInputSymbol = theInput[kk].symbol
          theInputHash = theInput[kk].hash
          theInputObject = theInput[kk]
          theInputObject.exited = theDate
          theInputObject.exitedPrice = thePrice
          break
        default:
          alert('Error: no "theEvent" parameter in reduceTargetState.js')
          debugger
      }
    }
    if (hh >= state.length) {
      //empty array of objects, no more currentListSymbols
      newState.push(theInputObject) //finish the new list objects
      ++kk
    } else if (kk >= theInput.length) {
      //empty list of inputs, no more theInputSymbols
      newState.push(state[hh]) //finish the current objects
      ++hh
    } else if (currentListSymbol < theInputSymbol) {
      newState.push(state[hh])
      ++hh
    } else if (currentListSymbol > theInputSymbol) {
      newState.push(theInputObject)
      ++kk
    } else if (currentListSymbol === theInputSymbol) {
      if (currentListHash === theInputHash) {
        alert('ERROR in reduceTargetState: Dup hash found for ' + theInputSymbol + ', object not added to list')
        debugger // stop for developer
        ++kk //skip this input object without adding again
      } else {
        newState.push(theInputObject) // put newest ahead of older object
        ++kk
      }
    }
  }
  //console.log(JSON.stringify(newState, null, 2)) // a readable log of the object's json
  return newState
}
