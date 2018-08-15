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
import { loadLocalState, saveLocalState } from './lib/localStorage'
import { loadFirebaseState, saveFirebaseState } from './lib/firebaseStorage'
import { resetCache } from './lib/chartDataCache'
import {} from './lib/chartDataCache'
import throttle from 'lodash/throttle'

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
  const demoMode = true // value returned from the ***SignIn***
  // const demoMode = false // value returned from the ***SignIn***

  let persistedState
  let store
  if (demoMode) {
    // let response = islocalStorageWorking()
    // if (!response) {
    //   alert(
    //     "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your data. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
    //   )
    // }
    persistedState = loadLocalState() //returns 'undefined' if error or no saved state
    store = createStore(rootReducer, persistedState) // 'persistedState' overrides the initial state specified by the reducers
  } else {
    // run with Firebase database store
    persistedState = undefined //no saved state until the Firebase database's read Promise is satisfied
    store = createStore(rootReducer, persistedState) // 'persistedState' overrides the initial state specified by the reducers
  }
  // Write the app state on every change only once per second
  store.subscribe(
    throttle(() => {
      demoMode ? saveLocalState(store.getState()) : saveFirebaseState(store.getState())
    }, 1000)
  )
  if (!demoMode) {
    loadFirebaseState(store) // start the async i/o to update store after store.subscribe is active
  }
  resetCache() // clear all previously cached chart price data for fresh start

  render(
    <ErrorBoundary>
      <Root store={store} />
    </ErrorBoundary>,
    document.getElementById('root')
  )
}
