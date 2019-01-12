// dbHelpers.js

import fire from '../fire'

export function firebaseImportState() {
  fire
    .database()
    .ref(reference)
    .set(cleanState, function(error) {
      if (error) {
        alert('Firebase: The database write failed. Error: ' + error) //rude interruption to user
      }
    })
}
