// SignIn/index.js

import React, { Component } from 'react'
// import { putReference, getReference, referenceRealtrader, referencePapertrader, referenceLocaltrader } from '../../lib/dbReference'
import BetaNotice from '../BetaNotice'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = { signedin: false }
  }

  render() {
    return <BetaNotice pageName={'SignIn'} />
  }

  // render() {
  //   putReference() //pass user selected trading mode: paper or real
  //   return <h3>Sign In</h3>
  // }
}

export default SignIn
