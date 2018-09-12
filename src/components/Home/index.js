import React, { Component } from 'react'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { firebaseSaveState } from '../../lib/firebaseSaveState'
import { loadLocalState, saveLocalState } from '../../lib/localStorage'
// import { islocalStorageWorking } from '../../lib/localStorage'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import { resetCache } from '../../lib/chartDataCache'
import throttle from 'lodash/throttle'
import fire from '../../fire'
// import logger from 'redux-logger'
// import Home from '../Home'
// import SignIn from '../SignIn'
import SignUp from '../SignUp'

import HomeJumbotron from './HomeJumbotron'
import HomeContent from './HomeContent'
import HomeFootnote from './HomeFootnote'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { stateRetrieved: 'pending', authenticated: false }
    this.reference = null // identifies the DB source for the app's store
  }
  componentDidMount() {
    window.scrollTo(0, 0)
    const { stateRetrieved, authenticated } = this.state
    // testlocalStorage() // test if disabled or full, needs to be enabled in /lib/localStorage
    resetCache() // clear all previously cached chart price data for fresh start
    let persistedState // receives the saved state from storage
    this.reference = getReference() //indicates which storage to use for app's state

    if (authenticated || this.reference === referenceLocaltrader) {
      //Continue with authenticated user running with Ameritrade api and Firebase api,
      //or with the unauthenticated user running with IEX api and local storage api.
      if (this.reference === referenceLocaltrader) {
        /* unauthenticated user */
        persistedState = loadLocalState() //returns (undefined) if error or no saved state
        // TODO get store from contex -> this.store = createStore(rootReducer, persistedState, applyMiddleware(thunk)) // 'persistedState' overrides the initial state specified by the reducers
        this.setState({ stateRetrieved: 'ready' }) // causes app to render
      } else {
        // running with Firebase database storage
        let self = this
        try {
          fire
            .database()
            .ref(this.reference) // see lib/dbReference.js for possible values
            .once('value')
            .then(function(snapshot) {
              if (snapshot) {
                // the snapshot.val is null if no saved state exists, using undefined creates default state in the store
                persistedState = snapshot.val() === null ? undefined : snapshot.val()
                // TODO get store from contex -> self.store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(self.reference), thunk)) // 'persistedState=snapshot.val' creates store with current state by overriding the initial state specified by the reducers
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
  }

  // testlocalStorage() {
  //   let response = islocalStorageWorking()
  //   if (!response) {
  //     alert(
  //       "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your data. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
  //     )
  //   }
  // }

  subscribe() {
    // this.store.subscribe(
    //   throttle(() => {
    //     saveLocalState(this.store.getState())
    //   }, 1000)
    // )
  }

  render() {
    const { stateRetrieved } = this.state
    const divStyle = { marginTop: 80, marginLeft: 50 }

    if (stateRetrieved === 'ready') {
      if (this.reference === referenceLocaltrader) {
        this.subscribe()
      }
      return (
        <div>
          <div>
            <HomeJumbotron />
          </div>
          <div>
            <HomeContent />
          </div>
          <div>
            <HomeFootnote />
          </div>
        </div>
      )
    } else if (stateRetrieved === 'pending') {
      return (
        <div style={divStyle}>
          <h4>{`Retrieving Your List Data. Please Wait...`}</h4>
        </div>
      )
    } else if (stateRetrieved === 'error') {
      return (
        <div style={divStyle}>
          <h4>{`Error While Retrieving Your Lists Data. Please Restart to Try Again...`}</h4>
        </div>
      )
    } else {
      alert('Error in this.state.stateRetrieved = ' + this.state.stateRetrieved)
    }
  }
}

export default Home
