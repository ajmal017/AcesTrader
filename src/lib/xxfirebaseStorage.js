// firebaseStorage.js

// Understand Auth and Rules: firebase.google.com/docs/database/security/

import fire from '../fire'

export const loadFirebaseState = () => {
  fire
    .database()
    .ref(referenceRealtrader)
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

// const saveFirebaseStateConfirmed = (state, reference) => {
  let completed = false
  let retries =0
  while (!completed) {
    fire
      .database()
      .ref(reference)
      .set(state, function(error) {
        if (error) {
          if (retries > 3) {
            // The write failed...
          } else {
            retries++
          }
        } else {
          completed=true
        }
      })
}
// }
