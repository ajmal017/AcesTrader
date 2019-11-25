// app/index.js

import React, { Component } from 'react'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { firebaseSaveState } from '../../lib/firebaseSaveState'
import rootReducer from '../../redux'
import Root from '../../components/Root'
import fire from '../../fire'
import firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/database'
import * as Sentry from '@sentry/browser'
import { AuthenticatedContext } from '../../redux'
import { clearLocalDatabase } from '../../lib/localDatabaseStorage'

export const ACESTRADERSTATE = 'at-state'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, authenticated: false, user: null, store: null }
  }

  async clearIEXLogs() {
    // This is used with special login which triggers this request
    alert('Clearing chart prices is not available yet with new cache in app state')
    await clearLocalDatabase() // initialize local database
  }
  componentDidMount() {
    const RELEASE = '1.3.*'
    if (process.env.NODE_ENV === 'production') {
      Sentry.init({
        dsn: 'https://e5464524db8f4d1791a5637c098e78e4@sentry.io/1300553',
        release: RELEASE,
      })
    }

    // Showing configuration for martinapps / acestrader at Firebase
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.email === 'zzzz@g.com') {
          this.clearIEXLogs()
        }

        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false,
        })
      } else {
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
      .then(function() {
        // Existing and future Auth states are now persisted in the current session only.
      })
      .catch(function(error) {
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
          function() {
            // console.log('Signed Out')
          },
          function(error) {
            // console.error('Sign Out Error', error)
          }
        )
      this.setState({ loading: true, store: theStore }) //wait for an onAuthStateChanged event to change this.state.loading
      //then continue on to the router to trigger the LogIn component
    }
  }

  render() {
    const { loading, store, authenticated, currentUser } = this.state

    // console.log(`App: loading=${loading} currentUser=${currentUser}`)

    if (loading) {
      const divStyle = { marginTop: 80, marginLeft: 50 }
      return (
        <div style={divStyle}>
          <h4>{'Starting The App. Please Wait...'}</h4>
        </div>
      )
    }

    return (
      <AuthenticatedContext.Provider value={currentUser}>
        <Root store={store} authenticated={authenticated} /> {/* shows Navbar */}
      </AuthenticatedContext.Provider>
    )
  }
}

export default App
