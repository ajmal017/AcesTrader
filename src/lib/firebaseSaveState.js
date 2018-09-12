// firebaseSaveState.js

import fire from '../fire'
import { getReference, referenceLocaltrader, referenceTempIgnore } from './dbReference'

export const saveState = () => {
  return {
    type: 'SAVE_STATE',
  }
}

// note: reference can be "realtrader", "papertrader", "debugtrader", "localtrader", or "tempignore"
// these are three separate stores in the clould  and one store in localstorage, plus a temporary ignore switch.
export function firebaseSaveState() {
  return ({ getState }) => (next) => (action) => {
    let reference = getReference() //indicates which storage to use for app state
    if (reference === referenceLocaltrader || reference === referenceTempIgnore) {
      return next(action) // cloud storage is not used for this user role
    }
    if (/^QUERY_/.test(action.type) || /^NOTIFICATION/.test(action.type)) {
      return next(action)
    }
    next(action) // run the reducers now to do any state changes

    let newState = getState()
    // console.log(JSON.stringify(newState, null, 2)) // a readable log of the state's json
    // Right click > Copy All in the Console panel to copy to clipboard

    let cleanState = JSON.parse(JSON.stringify(newState))
    // Because state can contain properties with value=func(), the above hack removes them.
    // For example after a modal dialog sequence, because of the callback provided we have:
    // property 'papertrader.modal.handleModalResonse' with contents = function ()

    // fire
    //   .database()
    //   .ref(reference)
    //   .set(cleanState)

    fire
      .database()
      .ref(reference)
      .set(cleanState, function(error) {
        if (error) {
          alert("Firebase: The database write failed while saving the changed list's state. Error: " + error) //rude interruption to user
        }
      })
  }
}
