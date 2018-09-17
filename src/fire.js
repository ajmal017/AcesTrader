//fire.js
import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyBooCcArQAIkaqzbDJWY9-mxP4dr9aKa84',
  authDomain: 'acestrader-4be71.firebaseapp.com',
  databaseURL: 'https://your_app_id.firebaseio.com',
  projectId: 'acestrader-4be71',
  storageBucket: 'acestrader-4be71.appspot.com',
  messagingSenderId: '289727366294',
}

// var config = {
//   apiKey: process.env.FIREBASE_KEY,
//   authDomain: process.env.FIREBASE_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_SENDER_ID,
// }

var fire = firebase.initializeApp(config)
export default fire
