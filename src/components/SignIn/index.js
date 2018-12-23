// SignIn/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import SignInView from './SignInView'
import fire from '../../fire'
import { putReference, referenceDebugtrader, referenceLocaltrader } from '../../lib/dbReference'

class SignInContainer extends Component {
  //
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDemoMode = this.handleDemoMode.bind(this)
    this.handleDemoInfo = this.handleDemoInfo.bind(this)
    this.state = {
      // reference: referenceDebugtrader,
    }
  }
  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      // this.setState({ reference: referenceDebugtrader, email: 'b@g.com', password: '079007' }) //change default user's role
      // Set the default sign in parameters for debug testing
      this.setState({ reference: referenceDebugtrader, email: 'b@g.com', password: '079007' }) //change default user's role
    }
  }

  handleChange = (event) => {
    this.setState({ reference: event.target.value }) //change user's role
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { reference } = this.state
    const { email, password } = event.target.elements
    putReference(reference) // user's role selected when form is submitted
    try {
      await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      this.props.history.push('/startUp')
    } catch (error) {
      alert(error)
    }
  }

  // handle the help icon click: show the guest user welcome page
  handleDemoInfo = (event) => {
    event.preventDefault()
    putReference(referenceLocaltrader)
    this.props.history.push('/welcomeguest')
  }

  // signin the Guest user so that authenticated=true is set allowing access to all nav links
  // the Reference=referenceLocaltrader constrains the Guest user to IEX api and local storage
  handleDemoMode = async (event) => {
    event.preventDefault()
    putReference(referenceLocaltrader)
    try {
      await fire.auth().signInWithEmailAndPassword('demouser@xmail.com', 'rfynmw#23&sxlz')
      this.props.history.push('/startUp')
    } catch (error) {
      alert(error)
    }
  }

  handleSignUp = (event) => {
    event.preventDefault()
    this.props.history.push('/signup')
  }

  render() {
    const { reference, email, password } = this.state
    return (
      <SignInView
        onSubmit={this.handleSubmit}
        onSignUp={this.handleSignUp}
        handleChange={this.handleChange}
        handleDemoMode={this.handleDemoMode}
        handleDemoInfo={this.handleDemoInfo}
        reference={reference}
        email={email}
        password={password}
      />
    )
  }
}

export default withRouter(SignInContainer)
