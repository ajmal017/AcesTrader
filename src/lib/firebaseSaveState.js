// firebaseSaveState.js

import fire from '../fire'
import { getReference, referenceLocaltrader } from './dbReference'
import { saveLocalState } from './localStorage'
import { ACESTRADERSTATE } from '../../../App'

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// note: reference can be "realtrader", "papertrader", "debugtrader", "localtrader", "ameritrade", "schwab", or "paper"
// these are separate stores in the clould and one store in localstorage
export function firebaseSaveState() {
  return ({ getState }) => (next) => (action) => {
    if (/^QUERY_/.test(action.type) || /^NOTIFICATION/.test(action.type)) {
      return next(action)
    }
    if (action.type === RESET_PERSISTED_STATE) {
      // stop here, do not write state back to storage during this operation
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

    let reference = getReference()
    if (reference === referenceLocaltrader) {
      saveLocalState(ACESTRADERSTATE, cleanState)
    } else {
      fire
        .database()
        .ref(reference)
        .set(cleanState, function (error) {
          if (error) {
            alert("Firebase: The database write failed while saving the changed list's state. Error: " + error) //rude interruption to user
          }
        })
    }
  }
}
