// appLoadDataForStore
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'

loadDataForStore = () => {
  // this.testlocalStorage() // test if disabled or full, needs to be enabled in /lib/localStorage
  resetDataCache() // clear all previously cached chart price data for fresh start
  resetPeekPrices() //clear old peek symbol prices
  let persistedState = null

  if (this.reference === referenceLocaltrader) {
    /* GUEST MODE USER WITH LOCAL STORAGE */
    persistedState = loadLocalState() //returns (undefined) if error or no saved state
    if (persistedState === undefined) {
      this.props.dispatch(resetDefaultState())
    } else {
      this.props.dispatch(resetPersistedState(persistedState))
      // this.props.dispatch({ type: 'RESET_PERSISTED_STATE', persistedState: persistedState })
    }
    this.setState({ stateRetrieved: 'ready' }) // causes app to render
  } else {
    console.log(`StartUp loadDataForStore1, reference=${this.reference}`) //BCM
    /* AUTHORIZED USER WITH FIREBASE RTDB */
    var myTimeoutVar = setTimeout(this.getDataTimedOut, 6000)
    var self = this
    try {
      fire
        .database()
        .ref(this.reference) // see lib/dbReference.js for possible values
        .once('value')
        .then(function(snapshot) {
          clearTimeout(myTimeoutVar)
          if (snapshot) {
            persistedState = snapshot.val()
            if (persistedState === null) {
              // the snapshot.val is null if no saved state is found,
              // so we will create the app's default state and it will be saved to storage
              self.props.dispatch(resetDefaultState())
            } else {
              // the saved state was recovered and can be used to set the app's state
              self.props.dispatch(resetPersistedState(persistedState))
            }
            self.setState({ stateRetrieved: 'ready' }) // causes app to render the initial navigation
          } else {
            self.setState({ stateRetrieved: 'error' }) // causes app to render an unsuccessful messsage
          }
        })
        .catch((error) => {
          alert('Firebase: The App/index database read failed while retrieving the state. Error: ' + error) //rude interruption to user
        })
    } catch (err) {
      alert('Firebase: The StartUp/index database read failed while retrieving the state. Error: ' + err.message) //rude interruption to user
    }
  }
}
