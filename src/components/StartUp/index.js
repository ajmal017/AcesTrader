// StartUp/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
// import { islocalStorageWorking } from '../../lib/localStorage'
import { loadLocalState } from '../../lib/localStorage'
import { resetDefaultState, resetPersistedState } from '../../redux/index.js'
import { resetPeekPrices } from '../../lib/appLastPeekPrice'
import { resetDataCache } from '../../lib/chartDataCache'
import fire from '../../fire'
import Welcome from '../../components/Welcome'
import WelcomeRealTrader from '../../components/Welcome/WelcomeRealTrader.js'

class StartUp extends Component {
  constructor(props) {
    super(props)
    this.reference = null // identifies the Firebase RTDB index for the app's state
    console.log('StartUp constructor') //BCM
    this.state = { stateRetrieved: 'pending' }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    // document.title = 'AcesTrader ' + this.reference[0].toUpperCase() + this.reference.substr(1)
    this.reference = getReference() //indicates which persisted data to use for app's state based on user's role
    console.log(`StartUp componentDidMount, reference=${this.reference}`) //BCM
    this.loadDataForStore() //start async operation to restore the user's app state
  }

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

  getDataTimedOut = () => {
    this.setState({ stateRetrieved: 'timeout' })
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
    this.reference = getReference() //indicates user's account choice

    if (stateRetrieved === 'pending') {
      return (
        <div style={divStyle}>
          <h4>{'Loading Your Saved Data. Please Wait...'}</h4>
        </div>
      )
    }

    if (stateRetrieved === 'timeout') {
      return (
        <div style={divStyle}>
          <h4>{'Timed Out Waiting To Retrieve Your Lists Data. Please Reload App And Try Again...'}</h4>
        </div>
      )
    }

    if (stateRetrieved === 'error') {
      return (
        <div style={divStyle}>
          <h4>{'Error While Retrieving Your Lists Data. Please Reload App And Try Again...'}</h4>
        </div>
      )
    }

    if (stateRetrieved === 'ready') {
      const titleArray = document.title.split(' ') //use to test current status before the change below
      document.title = 'AcesTrader ' + this.reference[0].toUpperCase() + this.reference.substr(1)
      if (titleArray.length === 1) {
        // This is the initial StartUp with the default dbReference selection,
        // the WelcomeRealTrader view has not been shown yet, so do it now
        // console.log('StartUp return <WelcomeRealTrader />') //BCM
        return <WelcomeRealTrader />
      } else {
        // This was a call to StartUp from the WelcomeRealTrader view, so confirm the user's selection
        // console.log('StartUp return <Welcome />') //BCM
        return <Welcome />
      }
    }
  }
}

//Note to self: this provides access to redux's dispatch()
const mapStateToProps = (state) => ({
  state: state,
})

export default connect(mapStateToProps)(StartUp)
