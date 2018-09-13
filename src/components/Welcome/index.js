// Welcome/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadLocalState } from '../../lib/localStorage'
// import { islocalStorageWorking } from '../../lib/localStorage'
import { putReference, getReference, referenceLocaltrader, referenceTempIgnore } from '../../lib/dbReference'
import { resetCache } from '../../lib/chartDataCache'
import fire from '../../fire'
// import logger from 'redux-logger'
import HomeJumbotron from '../../components/Home/HomeJumbotron'
import welcomeDemoTrader from './welcomeDemoTrader'
import welcomeTrader from './welcomeTrader'
import HomeFootnote from '../../components/Home/HomeFootnote'
import './styles.css'
import moveBuysToState from '../../redux/reducerBuys'
import removeAllBuysFromList from '../../redux/reducerBuys'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = { stateRetrieved: 'pending' }
    this.reference = null // identifies the DB source for the app's store
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    const { stateRetrieved } = this.state

    // fire
    //   .auth()
    //   .setPersistence(fire.auth.Auth.Persistence.SESSION)
    //   .then(function() {
    //     // Existing and future Auth states are now persisted in the current session only.
    //   })
    //   .catch(function(error) {
    //     var errorCode = error.code
    //     var errorMessage = error.message
    //     alert(errorCode, errorMessage)
    //   })

    // testlocalStorage() // test if disabled or full, needs to be enabled in /lib/localStorage
    resetCache() // clear all previously cached chart price data for fresh start
    let persistedState // receives the saved state from storage
    this.reference = getReference() //indicates which storage to use for app's state based on user's role

    if (this.reference === referenceLocaltrader) {
      /* demo mode user */

      persistedState = loadLocalState() //returns (undefined) if error or no saved state
      // if (persistedState !== undefined) {
      //   let savedReference = getReference()
      //   putReference(referenceTempIgnore) // tell middleware to not update the storage for these state changes
      //   // let buysFromStorage = persistedState.buys
      //   this.props.dispatch(moveBuysToState(persistedState.buys))
      //   putReference(savedReference) // tell middleware it's ok to update the storage for state changes
      // }

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

  // testlocalStorage() {
  //   let response = islocalStorageWorking()
  //   if (!response) {
  //     alert(
  //       "ERROR! Your computer's local storage is disabled or else is full. As a result AcesTrader can not save your data. Please enable local storage or increase your storage space quota or delete some plan files, depending on the situation."
  //     )
  //   }
  // }

  // subscribe() {
  // this.store.subscribe(
  //   throttle(() => {
  //     saveLocalState(this.store.getState())
  //   }, 1000)
  // )
  // }

  render() {
    const { stateRetrieved } = this.state
    const divStyle = { marginTop: 80, marginLeft: 50 }

    if (stateRetrieved === 'ready') {
      return (
        <div>
          <div>
            <HomeJumbotron />
          </div>
          <div className={'welcome-content'}>{this.reference === referenceLocaltrader ? welcomeDemoTrader() : welcomeTrader(this.reference)}</div>
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

//Note: this used only to get access to "this.props.dispatch", not for state access
const mapStateToProps = (state) => ({
  state: state,
})
export default connect(mapStateToProps)(Welcome)
