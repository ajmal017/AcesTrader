// app/index.js

import React, { Component } from 'react'
import { applyMiddleware, createStore } from 'redux'
import { firebaseSaveState } from '../../lib/firebaseSaveState'
import thunk from 'redux-thunk'
import rootReducer from '../../redux'
import ErrorBoundary from '../../components/ErrorBoundary/'
import Root from '../../components/Root'
import fire from '../../fire'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as Sentry from '@sentry/browser'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, authenticated: false, user: null, store: null }
  }

  componentDidMount() {
    // Showing configuration for martinapps / acestrader
    Sentry.init({ dsn: 'https://e5464524db8f4d1791a5637c098e78e4@sentry.io/1300553' })
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
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
    const { loading, store, authenticated } = this.state

    if (loading) {
      const divStyle = { marginTop: 80, marginLeft: 50 }
      return (
        <div style={divStyle}>
          <h4>{`Starting The App. Please Wait...`}</h4>
        </div>
      )
    }

    const sentry = false
    if (process.env.NODE_ENV === 'production') {
      sentry = true
    }
    // For discussion of the above trick for the sentry attribute on ErrorBoundary, see:
    // https://stackoverflow.com/questions/31163693/how-to-conditionally-add-attributes-to-react-components

    return (
      <ErrorBoundary sentry={sentry || null}>
        <Root store={store} authenticated={authenticated} /> {/* shows Navbar */}
      </ErrorBoundary>
    )
  }
}

export default App
