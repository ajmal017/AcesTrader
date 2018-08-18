// firebaseSaveState.js

import fire from '../fire'

export const saveState = (reference) => {
  return {
    type: 'SAVE_STATE',
    reference: reference,
  }
}

// note: reference can be "acestrader" or "papertrader", two separate stores
export function firebaseSaveState(reference) {
  return ({ getState }) => (next) => (action) => {
    if (/^QUERY_/.test(action.type) || /^NOTIFICATION/.test(action.type)) {
      return next(action)
    }
    next(action) // run the reducer to change the state
    fire
      .database()
      .ref(reference)
      .set(getState())
  }
}
