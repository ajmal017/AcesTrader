// @ts-nocheck

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
import { applyMiddleware, createStore } from 'redux'
import rootReducer from './redux'
import ErrorBoundary from './components/ErrorBoundary/'
import Root from './components/Root'
import { loadLocalState, saveLocalState } from './lib/localStorage'
// import { islocalStorageWorking } from './lib/localStorage'
import { getReference, localtrader } from './lib/dbReference'
import { firebaseSaveState } from './lib/firebaseSaveState'
import { resetCache } from './lib/chartDataCache'
import throttle from 'lodash/throttle'
import fire from './fire'
// import logger from 'redux-logger'

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
  let reference = getReference() //indicates which storage to use for app state
  // reference = referenceRealtrader   //override for testing
  // reference = referencePapertrader  //override for testing
  // reference = localtrader             //override for testing

  resetCache() // clear all previously cached chart price data for fresh start
  let stateRetrieved = 'pending' // switch to control the render
  let persistedState // receives the saved state from storage
  let store // receives the created store
  if (reference === localtrader) {
    // TestlocalStorage() // test if disabled or full, needs to be enabled in /lib/localStorage
    stateRetrieved = 'ready' // allow app to render
    persistedState = loadLocalState() //returns (undefined) if error or no saved state
    store = createStore(rootReducer, persistedState) // 'persistedState' overrides the initial state specified by the reducers
  } else {
    // running with Firebase database storage
    fire
      .database()
      .ref(reference)
      .once('value')
      .then(function(snapshot) {
        if (snapshot) {
          stateRetrieved = 'ready' // allow app to render since api call completed
          // the snapshot.val is null if no saved state exists, using undefined creates default state in the store
          persistedState = snapshot.val() === null ? undefined : snapshot.val()
          // store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(reference), logger)) // 'persistedState=snapshot.val' creates store with current state by overriding the initial state specified by the reducers
          store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(reference))) // 'persistedState=snapshot.val' creates store with current state by overriding the initial state specified by the reducers
        } else {
          stateRetrieved = 'error' //  the api call was unsuccessful
        }
        render(<DataStatus stateRetrieved={stateRetrieved} />, document.getElementById('root'))
      })
  }

  // function TestlocalStorage(props) {
  //   let response = islocalStorageWorking()
  //   if (!response) {
  //     alert(
  //       "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your data. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
  //     )
  //   }
  // }

  function subscribe() {
    store.subscribe(
      throttle(() => {
        saveLocalState(store.getState())
      }, 1000)
    )
  }

  function DataReady(props) {
    if (reference === localtrader) {
      subscribe()
    }
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
