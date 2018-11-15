// reducePeekData.js

var cloneDeep = require('lodash.clonedeep')

export default function(state, peekdataobject, theDate) {
  // Parameters:
  // state: A slice of the state as defined by combineReducers, the current target array of objects
  // listGroup: The current target group, 'prospects' or 'positions', determines the dashboard display formating
  // peekdataobject: An object with key/values for symbols and last price
  // theDate: A formatted date and time string
  let copyState = cloneDeep(state)
  let newState = copyState.map((obj) => {
    let symbol = obj.symbol
    let lastPrice = peekdataobject[symbol]
    obj['peekDate'] = theDate
    obj['peekPrice'] = lastPrice
    return obj // with updated dashboard state
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
