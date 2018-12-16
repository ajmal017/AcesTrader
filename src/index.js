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
import './styles/dialog-polyfill.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

// Import the utility code which tests if the screen size
// and grid support are both OK to run the app,
// else hang with error message shown on the splash screen,
// which tells to upgrade browser or use bigger screen.
import canapprun from './lib/canapprun.js'
import pinverified from './lib/pinverified.js'
import getOS from './lib/getOS.js'

// The getOS tests for an iOS or an Android OS and sets an global flag showing which is running.
// The flag is used to trigger any required programming hacks to work around OS problems.
// This flag is not used at 12/16/2018
getOS()

// The canapprun() tests for CSS Grid Layout feature, as it is required for the app's views.
// And the screen size is tested, as a minimum size is required for the app's views.
// If CSS Grid or minimum size is not available, canapprun() returns false
// and the splash screen stays with an error message displayed.

// The pinverified() tests the input entered on a keypad for correct pin number.
// This can be bypassed in the pinverfied code.

if (canapprun() && pinverified()) {
  ReactDOM.render(<App />, document.getElementById('root'))
}
