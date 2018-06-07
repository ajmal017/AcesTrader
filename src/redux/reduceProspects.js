// reduceProspects.js

export default function(state, newList, newDashboard) {
  // Parameters:
  // state: The current array of prospect objects, either Buys or Sells
  // newList: The new list of prospect symbols, either Buys or Sells
  // newDashboard: The default dashboard object to be included in the prospect objects
  let newState = [] // start with empty array to be populated below
  let date = new Date()
  let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  // Merge the prospect objects in alphabetical order in the newState array
  let hh = 0
  let kk = 0
  let currentListSymbol = null
  let newListSymbol = null
  let newListObject = null
  while (hh < state.length || kk < newList.length) {
    if (hh < state.length) {
      currentListSymbol = state[hh].symbol
    }
    if (kk < newList.length) {
      newListSymbol = newList[kk]
      newListObject = {
        watched: theDate,
        entered: null,
        exited: null,
        symbol: newListSymbol,
        dashboard: newDashboard,
      }
    }
    if (!currentListSymbol) {
      //initial condition
      newState.push(newListObject)
      ++kk
    } else if (currentListSymbol < newListSymbol) {
      newState.push(state[hh])
      ++hh
    } else if (currentListSymbol > newListSymbol) {
      newState.push(newListObject)
      ++kk
    } else if (currentListSymbol === newListSymbol) {
      //newState.push(newListObject) //keep the new one
      newState.push(state[hh]) //keep the current one, skip new one
      ++hh
      ++kk
    }
  }
  // console.log(JSON.stringify(newState, null, 2)) // a readable log of the object's json
  return newState
}
