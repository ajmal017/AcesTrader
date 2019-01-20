// Welcome/index.js

import React, { Component } from 'react'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import HomeJumbotron from '../../components/Home/HomeJumbotron'
import WelcomeGuestTrader from './WelcomeGuestTrader'
import GreetTrader from './GreetTrader'
// import HomeFootnote from '../../components/Home/HomeFootnote'
import './styles.css'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.reference = null // identifies the Firebase RTDB index for the app's selected state
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    this.reference = getReference() //indicates user's role
    console.log('Welcome, reference= ' + this.reference) //BCM
    return (
      <div className={'welcome-container'}>
        <div className={'welcome-header'}>
          <HomeJumbotron />
        </div>
        <div>{this.reference === referenceLocaltrader ? <WelcomeGuestTrader /> : <GreetTrader />}</div>
        {/* <div className={'welcome-footer'}>
          <HomeFootnote />
        </div> */}
      </div>
    )
  }
}

export default Welcome
