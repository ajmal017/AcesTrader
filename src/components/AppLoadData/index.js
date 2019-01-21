// AppLoadData/index.js

import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
// import { islocalStorageWorking } from '../../lib/localStorage'
import { loadLocalState } from '../../lib/localStorage'
import { resetDefaultState, resetPersistedState } from '../../redux/index.js'
import { resetPeekPrices } from '../../lib/appLastPeekPrice'
import { resetDataCache } from '../../lib/chartDataCache'
import fire from '../../fire'

const AppLoadData = (props) => {
  // testlocalStorage() // test if disabled or full; to work it needs to be enabled in /lib/localStorage
  resetDataCache() // clear all previously cached chart price data for fresh start
  resetPeekPrices() //clear old peek symbol prices for fresh start
  let persistedState = null // receives the state loaded from database
  const reference = getReference() // the current user's database selection

  // console.log(`AppLoadData begin:, reference=${reference}`) //BCM

  if (reference === referenceLocaltrader) {
    /* GUEST MODE USER WITH LOCAL STORAGE */
    persistedState = loadLocalState() //returns (undefined) if error or no saved state
    if (persistedState === undefined) {
      props.dispatch(resetDefaultState())
    } else {
      props.dispatch(resetPersistedState(persistedState))
      // props.dispatch({ type: 'RESET_PERSISTED_STATE', persistedState: persistedState })
    }
    // console.log(`AppLoadData finish:, reference=${reference}`) //BCM
    props.history.push(`/${props.next}`) // causes app to render the next navigation
  } else {
    // console.log(`AppLoadData start user load, reference=${reference}`) //BCM
    /* AUTHORIZED USER WITH FIREBASE RTDB */
    var myTimeoutVar = setTimeout(getDataTimedOut, 6000)
    try {
      fire
        .database()
        .ref(reference) // see lib/dbReference.js for possible values
        .once('value')
        .then(function(snapshot) {
          clearTimeout(myTimeoutVar)
          if (snapshot) {
            persistedState = snapshot.val()
            if (persistedState === null) {
              // the snapshot.val is null if no saved data is found,
              // so we will create the app's default state and it will be saved to storage
              props.dispatch(resetDefaultState())
            } else {
              // the saved data was recovered and can be used to set the app's state
              props.dispatch(resetPersistedState(persistedState))
            }
            // console.log(`AppLoadData DB finish:, props.next=${props.next}`) //BCM
            document.title = 'AcesTrader ' + reference[0].toUpperCase() + reference.substr(1)
            props.history.push(`/${props.next}`) // causes app to render the next navigation
          } else {
            alert('Firebase: The App database read returned an unsuccessful messsage') //rude interruption to user
            debugger
          }
        })
        .catch((error) => {
          alert('Firebase: The App/index database read failed while retrieving the state. Error: ' + error) //rude interruption to user
          debugger
        })
    } catch (err) {
      alert('Firebase: The StartUp/index database read failed while retrieving the state. Error: ' + err.message) //rude interruption to user
      debugger
    }
  }
  // console.log('AppLoadData return null') //BCM
  return null
}

const getDataTimedOut = () => {
  alert('Firebase: The App database read timed out') //rude interruption to user
  debugger
}

// testlocalStorage = () => {
//   let response = islocalStorageWorking()
//   if (!response) {
//     alert(
//       "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your data. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
//     )
//   }
// }

//Note: this provides access to redux's dispatch()
//Use a no-op function to avoid triggering a re-render due to a state change.
//We are not concerned with state, only want to run when called,
//but we need access to dispatch()
const mapStateToProps = () => ({})
export default withRouter(connect(mapStateToProps)(AppLoadData))
