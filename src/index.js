/**
 * index.js
 *
 * This is the entry file for the application
 */

// Import global css files
import './styles/normalize.css'
import './styles/bootstrap-cerulean.css'
import './styles/styles-global.css'

import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import rootReducer from './redux'
import ErrorBoundary from './components/ErrorBoundary/'
import Root from './components/Root'
import { loadLocalState, saveLocalState, islocalStorageWorking } from './lib/localStorage'
import { loadFirebaseState, saveFirebaseState } from './lib/firebaseStorage'
import { resetCache } from './lib/chartDataCache'
import {} from './lib/chartDataCache'
import throttle from 'lodash/throttle'
import fire from './fire'

// Import the utility code which tests if the screen size
// and grid support are both OK to run the app,
// else hang with error message shown on the splash screen.
import canapprun from './lib/canapprun.js'
import pinverified from './lib/pinverified.js'

// The canapprun() tests for CSS Grid Layout feature, as it is required for the app's views.
// And the screen size is tested, as a minimum size is required for the app's views.
// If CSS Grid or minimum size is not available, canapprun() returns false
// and the splash screen stays with an error message displayed.

// The pinverified() tests the input entered on a keypad for correct pin number.
// This can be bypassed in the pinverfied code.

if (canapprun() && pinverified()) {
  // **SignIn the user**

  // *******TODO SIGNIN********
  // const demoMode = true // value returned from the ***SignIn***
  const demoMode = false // value returned from the ***SignIn***

  resetCache() // clear all previously cached chart price data for fresh start
  const reference = 'acestrader'
  let stateRetrieved = 'pending' // switch to control the render
  let persistedState // receives the saved state from storage
  let store // receives the created store
  if (demoMode) {
    // TestlocalStorage() // test if disabled or full, needs to be enabled in /lib/localStorage
    stateRetrieved = 'ready' // allow app to render
    persistedState = loadLocalState() //returns (undefined) if error or no saved state
    store = createStore(rootReducer, persistedState) // 'persistedState' overrides the initial state specified by the reducers
  } else {
    // running with Firebase database storage
    persistedState = undefined //no saved state until the Firebase database's read Promise is satisfied
    store = createStore(rootReducer, persistedState) // 'persistedState=undefined' creates default state

    fire
      .database()
      .ref(reference)
      .once('value')
      .then(function(snapshot) {
        if (snapshot) {
          stateRetrieved = 'ready' // allow app to render if i/o successful
          persistedState = snapshot.val()
          store = createStore(rootReducer, persistedState) // 'persistedState=snapshot.val' creates store with current state by overriding the initial state specified by the reducers
        } else {
          stateRetrieved = 'error' //  i/o unsuccessful
        }
        render(<DataStatus stateRetrieved={stateRetrieved} />, document.getElementById('root'))
      })
  }

  function TestlocalStorage(props) {
    let response = islocalStorageWorking()
    if (!response) {
      alert(
        "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your data. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
      )
    }
  }

  function DataReady(props) {
    store.subscribe(
      throttle(() => {
        let test = store.getState()
        demoMode ? saveLocalState(store.getState()) : saveFirebaseState(store.getState())
      }, 1000)
    )
    return (
      <ErrorBoundary>
        <Root store={store} />{' '}
      </ErrorBoundary>
    )
  }
  function DataPending(props) {
    const divStyle = { marginTop: 80, marginLeft: 50 }
    return (
      <div style={divStyle}>
        <h4>{`Retrieving Your Data. Please Wait...`}</h4>
      </div>
    )
  }
  function DataError(props) {
    const divStyle = { marginTop: 80, marginLeft: 20 }
    return (
      <div style={divStyle}>
        <h4>{`Error While Retrieving Your Data. Please Restart to Try Again...`}</h4>
      </div>
    )
  }
  function DataStatus(props) {
    if (props.stateRetrieved === 'ready') {
      return <DataReady />
    } else if (props.stateRetrieved === 'pending') {
      return <DataPending />
    } else if (props.stateRetrieved === 'error') {
      return <DataError />
    } else {
      alert('Error in props.stateRetrieved = ' + props.stateRetrieved)
    }
  }
  render(<DataStatus stateRetrieved={stateRetrieved} />, document.getElementById('root'))
}
