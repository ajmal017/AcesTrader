// SignIn/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import SignInView from './SignInView'
import fire from '../../fire'
import WelcomeTrader from '../Welcome/WelcomeTrader';

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {}
  }
  componentDidMount() {
    document.title = 'AcesTrader'
    this.setState({ signedin: false })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    try {
      if (process.env.NODE_ENV === 'development') {
        await fire.auth().signInWithEmailAndPassword('z@g.com', 'bootonshop')
      } else {
        await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      }
      this.setState({ signedin: true })
    } catch (error) {
      alert(error)
      debugger //pause for developer
    }
  }

  handleSignUp = (event) => {
    event.preventDefault()
    debugger
  }

  render() {
    const { signedin } = this.state

    if (signedin === true) {
      return (
        <WelcomeTrader firstReference={'paper'} />
      )
    }

    return (
      <SignInView onSubmit={this.handleSubmit} />
    )
  }
}

export default withRouter(SignIn)
