// app/index.js

import React, { Component } from 'react'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../../redux'
import ErrorBoundary from '../../components/ErrorBoundary/'
import Root from '../../components/Root'
import RootNoProvider from '../../components/RootNoProvider'
import { firebaseSaveState } from '../../lib/firebaseSaveState'
import { loadLocalState } from '../../lib/localStorage'
// import { islocalStorageWorking } from '../../lib/localStorage'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import { resetCache } from '../../lib/chartDataCache'
import fire from '../../fire'
import firebase from 'firebase/app'
import 'firebase/auth'

class App extends Component {
  constructor(props) {
    super(props)
    // this.tempStore = null //dummy store
    this.store = null // receives the created store
    this.state = { loading: true, authenticated: false, user: null, stateRetrieved: 'pending' }
  }

  componentDidMount() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loadDataForStore()
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

  loadDataForStore = () => {
    // this.testlocalStorage() // test if disabled or full, needs to be enabled in /lib/localStorage
    resetCache() // clear all previously cached chart price data for fresh start
    let persistedState // receives the saved state from storage
    this.reference = getReference() //indicates which storage to use for app's state based on user's role

    if (this.reference === referenceLocaltrader) {
      /* demo mode user */
      persistedState = loadLocalState() //returns (undefined) if error or no saved state
      this.store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(this.reference), thunk)) // 'persistedState=snapshot.val' creates store with current state by overriding the initial state specified by the reducers
      this.setState({ stateRetrieved: 'ready' }) // causes app to render
    } else {
      /* running with Firebase database storage */
      var self = this
      try {
        fire
          .database()
          .ref(this.reference) // see lib/dbReference.js for possible values
          .once('value')
          .then(function(snapshot) {
            if (snapshot) {
              // the snapshot.val is null if no saved state exists, using undefined creates default state in the store
              persistedState = snapshot.val() === null ? undefined : snapshot.val()
              self.store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(self.reference), thunk)) // 'persistedState=snapshot.val' creates store with current state by overriding the initial state specified by the reducers
              self.setState({ stateRetrieved: 'ready' }) // causes app to render
            } else {
              self.setState({ stateRetrieved: 'error' }) // causes app to render an unsuccessful messsage
            }
          })
          .catch((error) => {
            alert('Firebase: The App/index database read failed while retrieving the state. Error: ' + error) //rude interruption to user
          })
      } catch (err) {
        alert('Firebase: The App/index database read failed while retrieving the state. Error: ' + err.message) //rude interruption to user
      }
    }
  }

  // testlocalStorage = () => {
  //   let response = islocalStorageWorking()
  //   if (!response) {
  //     alert(
  //       "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your data. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
  //     )
  //   }
  // }

  render() {
    const { loading, authenticated } = this.state
    const divStyle = { marginTop: 80, marginLeft: 50 }

    if (loading) {
      const divStyle = { marginTop: 80, marginLeft: 50 }
      return (
        <div style={divStyle}>
          <h4>{`Starting The App. Please Wait...`}</h4>
        </div>
      )
    }

    if (authenticated && this.state.stateRetrieved === 'retrieving') {
      return (
        <div style={divStyle}>
          <h4>{`Retrieving Your List Data. Please Wait...`}</h4>
        </div>
      )
    }

    if (authenticated && this.state.stateRetrieved === 'error') {
      return (
        <div style={divStyle}>
          <h4>{`Error While Retrieving Your Lists Data. Please Restart to Try Again...`}</h4>
        </div>
      )
    }

    // if (authenticated && this.state.stateRetrieved === 'pending') {
    //   // == START THE APP NOW ===
    // }

    if (!authenticated) {
      return <RootNoProvider authenticated={authenticated} /> // shows LogIn page
    }

    if (authenticated && this.state.stateRetrieved) {
    } // no op to see their value

    return (
      <ErrorBoundary>
        <Root store={this.store} authenticated={authenticated} /> {/* shows Navbar */}
      </ErrorBoundary>
    )
  }
}

export default App
