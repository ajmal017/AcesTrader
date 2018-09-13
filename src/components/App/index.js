// app/index.js

import React, { Component } from 'react'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { firebaseSaveState } from '../../lib/firebaseSaveState'
import rootReducer from '../../redux'
import ErrorBoundary from '../ErrorBoundary/'
import Root from '../Root'
import fire from '../../fire'

class App extends Component {
  constructor(props) {
    super(props)
    this.store = null // receives the created store
    this.state = { loading: true, authenticated: false, user: null }
  }

  componentDidMount() {
    let persistedState = undefined // persistedStat=undefined creates the default initial state as specified by the reducers defaults
    // we create the store with all the available middlewares; they are controlled dynamically depending on the user's role
    this.store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(), thunk, logger))

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

    // const { authenticated } = this.state
    // if (authenticated) {
    //   fire
    //     .auth()
    //     .setPersistence(fire.auth.Auth.Persistence.SESSION)
    //     .then(function() {
    //       // Existing and future Auth states are now persisted in the current
    //       // session only. Closing the window would clear any existing state even
    //       // if a user forgets to sign out.
    //       // ...
    //       // New sign-in will be persisted with session persistence.
    //       // return fire.auth().signInWithEmailAndPassword(email, password)
    //     })
    //     .catch(function(error) {
    //       // Handle Errors here.
    //       var errorCode = error.code
    //       var errorMessage = error.message
    //       alert(errorCode, errorMessage)
    //     })
    // }
  }

  render() {
    const { loading, authenticated } = this.state

    if (loading) {
      const divStyle = { marginTop: 80, marginLeft: 50 }
      return (
        <div style={divStyle}>
          <h4>{`Loading The App. Please Wait...`}</h4>
        </div>
      )
    } else {
      return (
        <ErrorBoundary>
          <Root store={this.store} authenticated={authenticated} />{' '}
        </ErrorBoundary>
      )
    }
  }
}
export default App
