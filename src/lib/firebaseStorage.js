// firebaseStorage.js

// Understand Auth and Rules: firebase.google.com/docs/database/security/

import fire from '../fire'
var cloneDeep = require('lodash.clonedeep')

// Get the JSON reference
const reference = 'acestrader'

// This functionality is handled by the reducers
// export const resetFirebaseState = () => {}

export const loadFirebaseState = () => {
  fire
    .database()
    .ref(reference)
    .once('value')
    .then(function(snapshot) {
      let result = snapshot ? snapshot.val() : undefined
      return result
    })
}

export const saveFirebaseState = (state) => {
  fire
    .database()
    .ref(reference)
    .set(state)
}
