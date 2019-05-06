// SignIn/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import SignInView from './SignInView'
import fire from '../../fire'
import { putReference, paper, referenceLocaltrader } from '../../lib/dbReference'
import WelcomeTrader from '../Welcome/WelcomeTrader';

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    // console.log(`SignIn: constructor getReference=${getReference()}`) //BCM
    this.state = {}
  }
  componentDidMount() {
    document.title = 'AcesTrader'
    // console.log(`SignIn: componentDidMount getReference=${getReference()}`) //BCM
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
      const user = await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      this.setState({ signedin: true })
      // this.props.history.push('/startup')
    } catch (error) {
      alert(error)
      debugger //pause for developer
    }
  }


  handleSignUp = (event) => {
    event.preventDefault()
    debugger
    // this.props.history.push('/signup')
  }

  render() {
    const { signedin, email, password } = this.state
    const divStyle = { marginTop: 80, marginLeft: 50 }

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
