// reduceTargetState.js

export default function(state, theInput, newDashboard, theDate, theEvent) {
  // Parameters:
  // state: The current target array of objects, either Prospects or Positions
  // theInput: A list of prospect symbols or watched objects to merge into this target state slice
  // newDashboard: The default dashboard object to be included in the each merged object
  let newState = [] // start with empty array to be populated below
  // Merge the input objects in alphabetical symbol order in the newState array
  let hh = 0
  let kk = 0
  let currentListSymbol = null
  let theInputSymbol = null
  let theInputObject = null
  while (hh < state.length || kk < theInput.length) {
    if (hh < state.length) {
      currentListSymbol = state[hh].symbol
    }
    if (kk < theInput.length) {
      switch (theEvent) {
        case 'watched': //theInput is a list of symbols going into Prospects
          theInputSymbol = theInput[kk]
          //create the watched asset object
          theInputObject = {}
          theInputObject.symbol = theInputSymbol
          theInputObject.dashboard = newDashboard //includes the order entry parameters
          theInputObject.watched = theDate
          break
        case 'entered': //theInput is a list of asset objects going into Positions
          theInputSymbol = theInput[kk].symbol
          theInputObject = theInput[kk]
          //update the entered asset object
          theInputObject.dashboard = newDashboard //includes the order exit parameters
          theInputObject.entered = theDate
          // theInputObject.enteredPrice = ???
          break
        default:
          debugger
          alert('Program error in reduceTargetState.js')
      }

      // theInputSymbol = theInput[kk]
      // theInputObject = {}
      // if (theEvent === 'watched') {
      //   //create the watched asset object
      //   theInputObject.symbol = theInputSymbol
      //   theInputObject.dashboard = newDashboard //includes the order entry parameters
      //   theInputObject.watched = theDate
      // } else if (theEvent === 'entered') {
      //   theInputObject.dashboard = newDashboard //includes the order exit parameters
      //   theInputObject.entered = theDate
      //   // theInputObject.enteredPrice = ???
      // } else if (theEvent === 'exited') {
      //   theInputObject.dashboard = null
      //   theInputObject.exited = theDate
      //   // theInputObject.exitedPrice = ???
      // }
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
      alert('ERROR in reduceTargetState: Dup symbols found.')
      // newState.push(state[hh]) //keep the current one, skip new one
      ++hh
      ++kk
    }
  }
  //console.log(JSON.stringify(newState, null, 2)) // a readable log of the object's json
  return newState
}
