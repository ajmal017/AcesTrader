// SignIn/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import SignInView from './SignInView'
import fire from '../../fire'
import { putReference, referenceRealtrader, referencePapertrader, referenceDebugtrader, referenceLocaltrader } from '../../lib/dbReference'

class SignInContainer extends Component {
  //
  // constructor(props) {
  //   super(props)
  //   // this.updateState = this.updateState.bind(this)
  //   // this.state = {
  //   //   email: '',
  //   //   password: '',
  //   //   userrole: '',
  //   // }
  // }

  // updateState(key, value) {
  //   this.setState({ [key]: value })
  // }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    // let emailValue, passwordValue
    // const { email, password, userrole } = this.state
    // if (userrole === referenceLocaltrader) {
    //   emailValue = 'demouser@xmail.com'
    //   passwordValue = 'rfynmw#23&sxlz'
    // } else {
    //   emailValue = email
    //   passwordValue = password
    // }
    putReference(referenceDebugtrader) //(userrole when form is done)
    try {
      await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      this.props.history.push('/welcome')
    } catch (error) {
      alert(error)
    }
  }

  // signin the Demo user so that authenticated=true is set allowing access to all nav links
  // the Reference=referenceLocaltrader constrains the Demo user to IEX api and local storage
  handleDemoMode = async (event) => {
    event.preventDefault()
    putReference(referenceLocaltrader)
    try {
      await fire.auth().signInWithEmailAndPassword('demouser@xmail.com', 'rfynmw#23&sxlz')
      this.props.history.push('/welcome')
    } catch (error) {
      alert(error)
    }
  }

  handleSignUp = (event) => {
    event.preventDefault()
    this.props.history.push('/signup')
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
    debugger
  }

  // handleLiveTrader = (event) => {
  //   putReference(referenceRealtrader)
  // }

  // handlePaperTrader = (event) => {
  //   putReference(referencePapertrader)
  // }
  // handleDebugTrader = (event) => {
  //   putReference(referenceDebugtrader)
  // }

  render() {
    return <SignInView onSubmit={this.handleSubmit} onSignUp={this.handleSignUp} handleChange={this.handleChange} handleDemoMode={this.handleDemoMode} />
  }
}

export default withRouter(SignInContainer)
