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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, authenticated: false, user: null, store: null }
  }

  componentDidMount() {
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
      //create the store object now with the app's state,
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
          <h4>{`Restarting The App. Please Wait...`}</h4>
        </div>
      )
    }

    // remove ErrorBoundary in effort to fix random crash in iOS
    return <Root store={store} authenticated={authenticated} />

    // return (
    //   <ErrorBoundary>
    //     <Root store={store} authenticated={authenticated} /> {/* shows Navbar */}
    //   </ErrorBoundary>
    // )
  }
}

export default App
