// Welcome/index.js

import React, { Component } from 'react'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import HomeJumbotron from '../../components/Home/HomeJumbotron'
import WelcomeGuestTrader from './WelcomeGuestTrader'
import WelcomeTrader from './WelcomeTrader'
import HomeFootnote from '../../components/Home/HomeFootnote'
import './styles.css'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.reference = null // identifies the RTDB index for the app's state
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    this.reference = getReference() //indicates user's role

    return (
      <div className={'welcome-container'}>
        <div className={'welcome-header'}>
          <HomeJumbotron />
        </div>
        <div className={'welcome-content'}>{this.reference === referenceLocaltrader ? WelcomeGuestTrader() : WelcomeTrader(this.reference)}</div>
        <div className={'welcome-footer'}>
          <HomeFootnote />
        </div>
      </div>
    )
  }
}

export default Welcome
