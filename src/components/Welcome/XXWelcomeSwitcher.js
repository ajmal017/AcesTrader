// WelcomeSwitcher.js

import React, { Component } from 'react'
import { getReference } from '../../lib/dbReference'
import WelcomeTrader from '../../components/Welcome/WelcomeTrader.js'

class WelcomeSwitcher extends Component {
  //   constructor(props) {
  //     super(props)
  //     this.reference = null // identifies the Firebase RTDB index for the app's selected state
  //   }

  //   componentDidMount() {
  //     window.scrollTo(0, 0)
  //   }

  render() {
    const reference = getReference() //indicates user's role
    // console.log('WelcomeSwitcher, reference= ' + reference) //BCM
    return <WelcomeTrader />
  }
}

export default WelcomeSwitcher
