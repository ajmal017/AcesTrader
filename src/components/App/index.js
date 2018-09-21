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
    this.store = null // receives the created store
    this.state = { loading: true, authenticated: false, user: null, stateRetrieved: 'pending' }
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
  }

  render() {
    const { loading, authenticated } = this.state
    const divStyle = { marginTop: 80, marginLeft: 50 }

    if (loading) {
      const divStyle = { marginTop: 80, marginLeft: 50 }
      return (
        <div style={divStyle}>
          {' '}
          <h4>{`Restarting The App. Please Wait...`}</h4>
        </div>
      )
    }

    // if (authenticated && this.state.stateRetrieved === 'retrieving') {
    //   return (
    //     <div style={divStyle}>
    //       <h4>{`Retrieving Your List Data. Please Wait...`}</h4>
    //     </div>
    //   )
    // }

    // if (authenticated && this.state.stateRetrieved === 'error') {
    //   return (
    //     <div style={divStyle}>
    //       <h4>{`Error While Retrieving Your Lists Data. Please Restart to Try Again...`}</h4>
    //     </div>
    //   )
    // }

    // if (authenticated && this.state.stateRetrieved === 'pending') {
    //   // == START THE APP NOW ===
    // }

    if (this.store === null) {
      // this is an initial load or a user reload
      if (authenticated) {
        // this is a user reload, force a signout to get back in sync
        fire
          .auth()
          .signOut()
          .then(
            function() {
              console.log('Signed Out')
            },
            function(error) {
              console.error('Sign Out Error', error)
            }
          )
        this.setState({ loading: true }) //wait for an onAuthStateChanged event
        const divStyle = { marginTop: 80, marginLeft: 50 }
        return (
          <div style={divStyle}>
            {' '}
            <h4>{`Starting The App. Please Wait...`}</h4>
          </div>
        )
      }
      //create the store object now with the default app state,
      //then continue on to the router to trigger the LogIn component
      let persistedState = undefined
      this.store = createStore(rootReducer, undefined, applyMiddleware(firebaseSaveState(this.reference), thunk)) // 'persistedState=undefined' creates store with default state by using the initial state specified by the reducers
    }

    return (
      <ErrorBoundary>
        <Root store={this.store} authenticated={authenticated} /> {/* shows Navbar */}
      </ErrorBoundary>
    )
  }
}

export default App
