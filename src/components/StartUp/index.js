// StartUp/index.js

import React, { Component } from 'react'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import AppLoadData from '../AppLoadData'

class StartUp extends Component {
  render() {
    const divStyle = { marginTop: 80, marginLeft: 50 }
    this.reference = getReference() //indicates user's portfolio selection

    this.next = 'WelcomeRealTrader'
    if (this.reference === referenceLocaltrader) {
      this.next = 'Welcome'
    }
    // console.log(`StartUp render:, this.next=${this.next}`) //BCM

    return (
      <>
        <div style={divStyle}>
          <h4>{'Loading Your Saved Data. Please Wait...'}</h4>
        </div>
        <AppLoadData next={this.next} />>
      </>
    )
  }
}

export default StartUp
