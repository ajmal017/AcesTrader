// Welcome/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
// import resetStateFromStorage from '../../redux'
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
    this.state = {}
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.setState({ stateRetrieved: 'pending' })
    // == Restore the user's state now ===
    this.loadDataForStore() //start async operation
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
      var myTimeoutVar = setTimeout(this.getDataTimedOut, 6000)
      try {
        fire
          .database()
          .ref(this.reference) // see lib/dbReference.js for possible values
          .once('value')
          .then(function(snapshot) {
            clearTimeout(myTimeoutVar)
            if (snapshot) {
              // the snapshot.val is null if no saved state exists
              persistedState = snapshot.val()
              if (persistedState === null) {
                self.setState({ stateRetrieved: 'error' }) // causes app to render an unsuccessful messsage
              } else {
                // this.props.dispatch(resetStateFromStorage( persistedState))
                this.props.dispatch({ type: 'RESET_STATE', persistedState: persistedState })
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

  getDataTimedOut = () => {
    this.setState({ stateRetrieved: 'ready' }) // fake promise resolve
    // this.setState({ stateRetrieved: 'timeout' })
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
      return (
        <div style={divStyle}>
          <h4>{`Retrieving Your List Data. Please Wait...`}</h4>
        </div>
      )
    }

    if (stateRetrieved === 'timeout') {
      return (
        <div style={divStyle}>
          <h4>{`Timed Out Waiting To Retrieve Your Lists Data. Please Reload App And Try Again...`}</h4>
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
