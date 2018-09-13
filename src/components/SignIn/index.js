// SignIn/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import SignInView from './SignInView'
import fire from '../../fire'
import { putReference, referenceRealtrader, referencePapertrader, referenceDebugtrader, referenceLocaltrader } from '../../lib/dbReference'

class SignInContainer extends Component {
  handleSignIn = async (event) => {
    event.preventDefault()
    putReference(referenceDebugtrader) //TODO Temp until this form is finished
    const { email, password } = event.target.elements
    try {
      const user = await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      this.props.history.push('/welcome')
    } catch (error) {
      alert(error)
    }
  }

  // signin the Demo user so that authenticated=true is set allowing access to all nav links
  // the Reference=referenceLocaltrader constrains this user to IEX api and local storage
  handleDemoMode = async (event) => {
    event.preventDefault()
    putReference(referenceLocaltrader)
    try {
      const user = await fire.auth().signInWithEmailAndPassword('demouser@xmail.com', 'rfynmw#23&sxlz')
      this.props.history.push('/welcome')
    } catch (error) {
      alert(error)
    }
  }

  handleSignUp = (event) => {
    event.preventDefault()
    this.props.history.push('/signup')
  }

  handleRealTrader = (event) => {
    putReference(referenceRealtrader)
  }

  handlePaperTrader = (event) => {
    putReference(referencePapertrader)
  }
  handleDebugTrader = (event) => {
    putReference(referenceDebugtrader)
  }

  render() {
    return (
      <SignInView
        onSubmit={this.handleSignIn}
        onSignUp={this.handleSignUp}
        onDemoMode={this.handleDemoMode}
        onRealTrader={this.handleRealTrader}
        onPaperTrader={this.handlePaperTrader}
        onDebugTrader={this.handleDebugTrader}
      />
    )
  }
}

export default withRouter(SignInContainer)
