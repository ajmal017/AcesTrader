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
    if (process.env.NODE_ENV === 'development') {
      // Set the default sign in parameters for development testing
      this.setState({ signedin: false, email: 'a@g.com', password: 'bootonaces' }) //change to use default user's sign in
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    // putReference(paper) // the default radio button for portfolio selection at sign in
    try {
      // const user = await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      await fire.auth().signInWithEmailAndPassword(email.value, password.value)
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
    const { signedin, email, password } = this.state

    if (signedin === true) {
      return (
        <WelcomeTrader firstReference={'paper'} />
      )
    }

    return (
      <SignInView
        onSubmit={this.handleSubmit}
        onSignUp={this.handleSignUp}
        email={email}
        password={password}
      />
    )
  }
}

export default withRouter(SignIn)
