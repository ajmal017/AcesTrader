// reduceInsertedObject.js

export default function(state, theInputObject) {
  // Parameters:
  // state: The current target array of objects, either Prospects or Positions

  // theInputObject: An object to merge into this target state
  let newState = [] // start with empty array to be populated below with objects
  // Merge the input object in alphabetical symbol order in the newState array
  let hh = 0
  let kk = 0
  let currentListSymbol = null
  let currentListHash = null
  let theInputSymbol = null
  let theInputHash = null
  let theInput = [theInputObject] //make an array to be compatible with the copied logic below
  while (hh < state.length || kk < theInput.length) {
    if (hh < state.length) {
      currentListSymbol = state[hh].symbol
      currentListHash = state[hh].hash
    }
    if (kk < theInput.length) {
      theInputSymbol = theInput[kk].symbol
      theInputHash = theInput[kk].hash
      theInputObject = theInput[kk]
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
        alert('ERROR in reduceInsertedObject: Dup hash found for ' + theInputSymbol + ', object not replaced in list, it is MIA')
        debugger //pause for programmer inspection
      } else {
        newState.push(theInputObject) // put newest ahead of older object
        ++kk
      }
    }
  }
  //console.log(JSON.stringify(newState, null, 2)) // a readable log of the object's json
  return newState
}
