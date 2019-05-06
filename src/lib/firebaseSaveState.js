// firebaseSaveState.js

import fire from '../fire'
import { getReference } from './dbReference'

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// note: reference can be "ameritrade", "schwab", or "paper"
// these are separate stores in the clould
export function firebaseSaveState() {
  return ({ getState }) => (next) => (action) => {
    if (/^QUERY_/.test(action.type) || /^NOTIFICATION/.test(action.type)) {
      return next(action)
    }
    if (action.type === RESET_PERSISTED_STATE) {
      // STOP HERE, do not write state back to storage during this operation
      // there are no state changes 
      // we are copying state from persisted storage into app's memory state
      return next(action)
    }

    next(action) // run the reducers now to do any state changes

    let newState = getState()
    // console.log(JSON.stringify(newState, null, 2)) // a readable log of the state's json
    // note: you can Right click > Copy All in the Console panel to copy to clipboard
    let cleanState = JSON.parse(JSON.stringify(newState))
    // Because state can contain properties with value=func(), the above hack removes them.
    // For example after a modal dialog sequence, because of the callback provided we have:
    // property 'papertrader.modal.handleModalResonse' with contents = function ()


    debugger //pause for developer stop here while still testing new data retrieval code //BCM


    let reference = getReference()
    fire
      .database()
      .ref(reference)
      .set(cleanState, function (error) {
        if (error) {
          console.log("Firebase: The database write failed while saving the changed list's state. Error: " + error)
          if (process.env.NODE_ENV === 'development') { debugger } //pause for developer
          alert("Firebase: The database write failed while saving the changed list's state. Error: " + error) //rude interruption to user
        }
      })
  }
}
