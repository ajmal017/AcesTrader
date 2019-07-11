// app/index.js

import React, { Component } from 'react'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { firebaseSaveState } from '../../lib/firebaseSaveState'
import { clearLocalDatabase } from '../../lib/localDatabaseStorage'
import rootReducer from '../../redux'
import ErrorBoundary from '../../components/ErrorBoundary/'
import Root from '../../components/Root'
import fire from '../../fire'
import firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/database'
import * as Sentry from '@sentry/browser'
import { AuthenticatedContext } from '../../redux'

export const ACESTRADERSTATE = 'at-state'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, authenticated: false, user: null, store: null }
  }

  componentDidMount() {
    const RELEASE = '1.3.*'
    if (process.env.NODE_ENV === 'production') {
      Sentry.init({
        dsn: 'https://e5464524db8f4d1791a5637c098e78e4@sentry.io/1300553',
        release: RELEASE,
      })
    }

    let escapeKey = false
    const catchKeyup = (event) => {
      if (event.defaultPrevented) {
        return
      }
      let key = event.key || event.keyCode;
      if (key === 'Escape' || key === 'Esc' || key === 27) {
        escapeKey = true
      } else {
        escapeKey = false
      }
    }

    // Showing configuration for martinapps / acestrader at Firebase
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        if (escapeKey) {
          alert('Clearing Local Database')
          clearLocalDatabase() // initialize local database
          escapeKey = false
        }
        document.removeEventListener('keyup', catchKeyup)
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false,
        })
      } else {
        document.addEventListener('keyup', catchKeyup)
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false,
        })
      }
    })

    fire
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current session only.
      })
      .catch(function (error) {
        var errorCode = error.code
        var errorMessage = error.message
        alert(errorCode, errorMessage)
      })

    if (this.state.store === null) {
      // this is either an initial load or a user reload
      //create the store object now with the app's default state,
      let theStore = createStore(rootReducer, undefined, applyMiddleware(firebaseSaveState(this.reference), thunk)) // 'persistedState=undefined' creates store with default state by using the initial state specified by the reducers
      // to handle a possible user reload, force a signout to get back in sync
      fire
        .auth()
        .signOut()
        .then(
          function () {
            // console.log('Signed Out') //BCM
          },
          function (error) {
            // console.error('Sign Out Error', error) //BCM
          }
        )
      this.setState({ loading: true, store: theStore }) //wait for an onAuthStateChanged event to change this.state.loading
      //then continue on to the router to trigger the LogIn component
    }
  }

  render() {
    const { loading, store, authenticated, currentUser } = this.state

    // console.log(`App: loading=${loading} currentUser=${currentUser}`) //BCM

    if (loading) {
      const divStyle = { marginTop: 80, marginLeft: 50 }
      return (
        <div style={divStyle}>
          <h4>{'Starting The App. Please Wait...'}</h4>
        </div>
      )
    }

    return (
      <ErrorBoundary>
        <AuthenticatedContext.Provider value={currentUser}>
          <Root store={store} authenticated={authenticated} /> {/* shows Navbar */}
        </AuthenticatedContext.Provider>
      </ErrorBoundary>
    )
  }
}

export default App
