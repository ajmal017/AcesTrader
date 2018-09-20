// Welcome/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import resetStateFromStorage from '../../redux'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
// import { islocalStorageWorking } from '../../lib/localStorage'
import { loadLocalState } from '../../lib/localStorage'
import { resetCache } from '../../lib/chartDataCache'
import fire from '../../fire'
import HomeJumbotron from '../../components/Home/HomeJumbotron'
import WelcomeDemoTrader from './WelcomeDemoTrader'
import WelcomeTrader from './WelcomeTrader'
import HomeFootnote from '../../components/Home/HomeFootnote'
import './styles.css'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.reference = null // identifies the DB source for the app's store
    this.state = { stateRetrieved: 'pending' }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  loadDataForStore = () => {
    // this.testlocalStorage() // test if disabled or full, needs to be enabled in /lib/localStorage
    resetCache() // clear all previously cached chart price data for fresh start
    let persistedState // receives the saved state from storage
    this.reference = getReference() //indicates which storage to use for app's state based on user's role

    if (this.reference === referenceLocaltrader) {
      /* demo mode user */
      persistedState = loadLocalState() //returns (undefined) if error or no saved state
      // this.props.dispatch(resetStateFromStorage( persistedState))
      this.props.dispatch({ type: 'RESET_STATE', persistedState: persistedState })
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
              persistedState = snapshot.val()
              if (persistedState === null) {
                self.setState({ stateRetrieved: 'error' }) // causes app to render an unsuccessful messsage
              } else {
                this.props.dispatch(resetStateFromStorage('buys', persistedState.buys))
                // self.store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(self.reference), thunk)) // 'persistedState=snapshot.val' creates store with current state by overriding the initial state specified by the reducers
                self.setState({ stateRetrieved: 'ready' }) // causes app to render
              }
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
    const { stateRetrieved } = this.state
    const divStyle = { marginTop: 80, marginLeft: 50 }
    this.reference = getReference() //indicates user's role

    if (stateRetrieved === 'pending') {
      // == Restore the user's state now ===
      this.loadDataForStore() //start async operation
      return (
        <div style={divStyle}>
          <h4>{`Retrieving Your List Data. Please Wait...`}</h4>
        </div>
      )
    }

    if (stateRetrieved === 'error') {
      return (
        <div style={divStyle}>
          <h4>{`Error While Retrieving Your Lists Data. Please Reload App And Try Again...`}</h4>
        </div>
      )
    }

    return (
      <div>
        <div>
          <HomeJumbotron />
        </div>
        <div className={'welcome-content'}>{this.reference === referenceLocaltrader ? WelcomeDemoTrader() : WelcomeTrader(this.reference)}</div>
        <div>
          <HomeFootnote />
        </div>
      </div>
    )
  }
}

//Note to self: this provides access to redux's dispatch()
const mapStateToProps = (state) => ({
  state: state,
})

export default connect(mapStateToProps)(Welcome)
