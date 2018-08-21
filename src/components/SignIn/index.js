// SignIn/index.js

import React, { Component } from 'react'
import { putReference, getReference, referenceRealtrader, referencePapertrader, referenceLocaltrader } from './lib/dbReference'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = { signedin: false }
  }

  render() {
    putReference()
    return <h3>Sign In</h3>
  }
}

export default SignIn
