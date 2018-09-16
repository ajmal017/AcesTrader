// SignUp/index.js

import React, { Component } from 'react'
import fire from '../../fire'
import SignUpView from './SignUpView'

class SignUpContainer extends Component {
  handleSignUp = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    try {
      const user = await fire.auth().createUserWithEmailAndPassword(email.value, password.value)
      this.props.history.push('/')
    } catch (error) {
      alert(error)
    }
  }

  render() {
    return <SignUpView onSubmit={this.handleSignUp} />
  }
}

export default SignUpContainer
