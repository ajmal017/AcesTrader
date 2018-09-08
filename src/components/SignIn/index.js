// SignIn/index.js

import React, { Component } from 'react'
// import { putReference, getReference, referenceRealtrader, referencePapertrader,referenceDebugtrader, referenceLocaltrader } from '../../lib/dbReference'
import BetaNotice from '../BetaNotice'
import getFillPrice from '../../lib/apiGetFillPrice' //TEMPORARY SCRATCH WORK

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = { signedin: false }
  }

  //TEMPORARY SCRATCH WORK AREA TO TEST CALL TO AXIOS
  // getTheFillPrice = () => {
  // }
  //TEMPORARY SCRATCH WORK AREA TO TEST CALL TO AXIOS

  render() {
    const symbol = 'amzn'
    getFillPrice(symbol)
      .then(function(data) {
        return data
      })
      .catch(function(error) {
        console.log('getFillPrice axios error:', error.message)
        alert('getFillPrice axios error: ' + error.message) //rude interruption to user
      })
    return <BetaNotice pageName={'SignIn'} />
  }

  // render() {
  //   putReference() //pass user selected trading mode: paper or real
  //   return <h3>Sign In</h3>
  // }
}

export default SignIn
