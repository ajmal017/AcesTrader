// SignIn/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import SignInView from './SignInView'
import fire from '../../fire'
import { putReference, referenceRealtrader, referencePapertrader, referenceDebugtrader, referenceLocaltrader } from '../../lib/dbReference'

class SignInContainer extends Component {
  //
  constructor(props) {
    super(props)
    this.updateState = this.updateState.bind(this)
    // this.handleLogin = this.handleLogin.bind(this)
    // this.bubleUpSignup = this.bubleUpSignup.bind(this)
    // this.bubleUpRecoverPassword = this.bubleUpRecoverPassword.bind(this)

    this.state = {
      // isRecoveringPassword: this.props.isRecoveringPassword,
      // passwordConfirmation: '',
      // isLogin: this.props.isLogin,
      email: '',
      password: '',
      userrole: '',
    }
  }

  updateState(key, value) {
    this.setState({ [key]: value })
  }

  // signin the Guest user so that authenticated=true is set allowing access to all nav links
  // the Reference=referenceLocaltrader constrains the Guest user to IEX api and local storage
  handleSignIn = async (event) => {
    event.preventDefault()
    let emailValue, passwordValue
    const { email, password, userrole } = this.state
    if (userrole === referenceLocaltrader) {
      emailValue = 'demouser@xmail.com'
      passwordValue = 'rfynmw#23&sxlz'
    } else {
      emailValue = email
      passwordValue = password
    }
    putReference(userrole)
    this.props.history.push('/welcome')
    try {
      await fire.auth().signInWithEmailAndPassword(emailValue, passwordValue)
    } catch (error) {
      alert(error)
    }
  }

  // signin the Guest user so that authenticated=true is set allowing access to all nav links
  // the Reference=referenceLocaltrader constrains the Guest user to IEX api and local storage
  handleDemoMode = async (event) => {
    event.preventDefault()
    putReference(referenceLocaltrader)
    this.props.history.push('/welcome')
    try {
      await fire.auth().signInWithEmailAndPassword('demouser@xmail.com', 'rfynmw#23&sxlz')
    } catch (error) {
      alert(error)
    }
  }

  handleSignUp = (event) => {
    event.preventDefault()
    this.props.history.push('/signup')
  }

  handleLiveTrader = (event) => {
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
        email={this.state.email}
        password={this.state.password}
        styles={this.props.styles}
        onSubmit={this.handleSignIn}
        onSignUp={this.handleSignUp}
        onDemoMode={this.handleDemoMode}
        onLiveTrader={this.handleLiveTrader}
        onPaperTrader={this.handlePaperTrader}
        onDebugTrader={this.handleDebugTrader}
        usernameCustomLabel={'usernameCustomLabel'}
        passwordCustomLabel={'passwordCustomLabel'}
        recoverPasswordCustomLabel={'recoverPasswordCustomLabel'}
        goToSignupCustomLabel={'goToSignupCustomLabel'}
        submitLoginCustomLabel={'submitLoginCustomLabel'}
      />
    )
  }
}

SignInContainer.propTypes = {
  styles: PropTypes.shape({
    wrapper: PropTypes.object,
    inputWrapper: PropTypes.object,
    buttonsWrapper: PropTypes.object,
    input: PropTypes.object,
    recoverPasswordWrapper: PropTypes.object,
    recoverPasswordButton: PropTypes.object,
    button: PropTypes.object,
  }),
}

SignInContainer.defaultProps = {
  styles: {
    wrapper: {
      border: '1px solid #eee',
      borderRadius: 3,
      backgroundColor: '#FAFAFA',
      margin: 10,
      padding: 20,
      maxWidth: '500px',
      width: 500,
      height: 400,
      perspective: 1000,
    },
  },
}

export default withRouter(SignInContainer)
