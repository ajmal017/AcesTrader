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
import { loadState, saveState } from './lib/localStorage'
import throttle from 'lodash/throttle'

// Import the utility code which tests if the screen size
// and grid support are both OK to run the app,
// else hang with error message shown on the splash screen.
import canapprun from './lib/canapprun.js'
import pinverified from './lib/pinverified.js'
import { startDropboxConnection } from './lib/dropboxconnection'

// The canapprun() tests for CSS Grid Layout feature, as it is required for the app's views.
// And the screen size is tested, as a minimum size is required for the app's views.
// If CSS Grid or minimum size is not available, canapprun() returns false
// and the splash screen stays with an error message displayed.

// The pinverified() tests the input entered on a keypad for correct pin number.
// This can be bypassed in the pinverfied code.

if (canapprun() && pinverified()) {
  const persistedState = loadState() //returns 'undefined' if error or no saved state
  const store = createStore(rootReducer, persistedState) // 'persistedState' overrides the initial state specified by the reducers

  // let response = islocalStorageWorking()
  // if (!response) {
  //   alert(
  //     "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your work. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
  //   )
  // }

  let response = startDropboxConnection()
  if (!response) {
    alert('ERROR! Your Dropbox connection is disabled or else unavailable. As a result AcesTrader can not save your work.')
    // } else {
    //   alert('Dropbox connected')
  }

  // Write the app state on every change only once per second
  store.subscribe(
    throttle(() => {
      saveState(store.getState())
    }, 1000)
  )

  render(
    <ErrorBoundary>
      <Root store={store} />
    </ErrorBoundary>,
    document.getElementById('root')
  )
}
