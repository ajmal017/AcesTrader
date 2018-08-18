// firebaseStorage.js

// Understand Auth and Rules: firebase.google.com/docs/database/security/

import fire from '../fire'

// Get the JSON reference
export const referenceAcestrader = 'acestrader'
export const referencePapertrader = 'papertrader'

export const loadFirebaseState = () => {
  fire
    .database()
    .ref(referenceAcestrader)
    .once('value')
    .then(function(snapshot) {
      let result = snapshot ? snapshot.val() : undefined
      return result
    })
}

export const saveFirebaseState = (state, reference) => {
  fire
    .database()
    .ref(reference)
    .set(state)
}
