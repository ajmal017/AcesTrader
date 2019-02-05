// SignIn/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import SignInView from './SignInView'
import fire from '../../fire'
import { putReference, paper, referenceLocaltrader } from '../../lib/dbReference'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDemoMode = this.handleDemoMode.bind(this)
    this.handleDemoInfo = this.handleDemoInfo.bind(this)
    // console.log(`SignIn: constructor getReference=${getReference()}`) //BCM
    this.state = {}
  }
  componentDidMount() {
    document.title = 'AcesTrader'
    // console.log(`SignIn: componentDidMount getReference=${getReference()}`) //BCM
    if (process.env.NODE_ENV === 'development') {
      // Set the default sign in parameters for debug testing
      this.setState({ email: 'a@g.com', password: 'bootonaces' }) //change to use default user's sign in
      //this.setState({ reference: referencePapertrader, email: 'b@g.com', password: '079007' }) //change default user's role
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    try {
      await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      putReference(paper) // the default radio button for portfolio selection at sign in
      this.props.history.push('/StartUp')
    } catch (error) {
      alert(error)
    }
  }

  // handle the help icon click: show the guest information page
  handleDemoInfo = (event) => {
    event.preventDefault()
    this.props.history.push('/welcomeguest')
  }

  // signin the Guest user so that authenticated=true is set allowing access to all nav links
  // the Reference=referenceLocaltrader constrains the Guest user to IEX api and local storage
  handleDemoMode = async (event) => {
    event.preventDefault()
    putReference(referenceLocaltrader) // this is a Guest user
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
    const { email, password } = this.state
    return (
      <SignInView
        onSubmit={this.handleSubmit}
        onSignUp={this.handleSignUp}
        handleDemoMode={this.handleDemoMode}
        handleDemoInfo={this.handleDemoInfo}
        email={email}
        password={password}
      />
    )
  }
}

export default withRouter(SignIn)
