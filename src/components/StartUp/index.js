// StartUp/index.js

import React, { Component } from 'react'
import WelcomeTrader from '../Welcome/WelcomeTrader';

class StartUp extends Component {
  render() {
    const divStyle = { marginTop: 80, marginLeft: 50 }

    // console.log(`StartUp renders WelcomeTrader for first time`) //BCM

    return (
      <>
        <div style={divStyle}>
          <h4>{'Loading Your Saved Data. Please Wait...'}</h4>
        </div>
        <WelcomeTrader firstReference={'paper'} />
      </>
    )
  }
}

export default StartUp
