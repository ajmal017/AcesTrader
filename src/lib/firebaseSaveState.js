// firebaseSaveState.js

import fire from '../fire'

export const saveState = (reference) => {
  return {
    type: 'SAVE_STATE',
    reference: reference,
  }
}

// note: reference can be "realtrader" or "papertrader";
// these are two separate stores.
export function firebaseSaveState(reference) {
  return ({ getState }) => (next) => (action) => {
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

    let completed = false
    let retries = 0
    do {
      fire
        .database()
        .ref(reference)
        /* eslint no-loop-func: 0 */
        .set(cleanState, function(error) {
          if (error) {
            if (retries > 3) {
              alert("The database write failed while saving the changed list's state.") //rude interruption to user
            } else {
              retries++
            }
          } else {
            completed = true
          }
        })
    } while (!completed)
  }
}
