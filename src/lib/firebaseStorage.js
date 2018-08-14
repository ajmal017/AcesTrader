// firebaseStorage.js

// Understand Auth and Rules: firebase.google.com/docs/database/security/

import fire from '../fire'

// Get the JSON reference
const reference = 'acestrader'

// This functionality is handled by the reducers
// export const resetFirebaseState = () => {}

export const loadFirebaseState = () => {
  return fire
    .database()
    .ref(reference)
    .once('value')
    .then(function(snapshot) {
      return snapshot ? snapshot.val() : 'undefined'
    })
}

export const saveFirebaseState = (state) => {
  fire
    .database()
    .ref(reference)
    .set(state)
}
