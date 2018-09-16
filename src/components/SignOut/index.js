// SignOut/index.js

import React, { Component } from 'react'
import fire from '../../fire'
import SignIn from './../SignIn'

class SignOut extends Component {
  componentDidMount() {
    fire
      .auth()
      .signOut()
      .then(
        function() {
          console.log('Signed Out')
        },
        function(error) {
          console.error('Sign Out Error', error)
        }
      )
  }
  render() {
    return <SignIn />
  }
}

export default SignOut
