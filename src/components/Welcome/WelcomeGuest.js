// WelcomeGuest.js

import React, { Component } from 'react'
import HomeJumbotron from '../../components/Home/HomeJumbotron'
import WelcomeGuestTrader from './WelcomeGuestTrader'
import HomeFootnote from '../../components/Home/HomeFootnote'
import './styles.css'

class WelcomeGuest extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <div>
        <div>
          <HomeJumbotron />
        </div>
        <div className={'welcome-content'}> {WelcomeGuestTrader()} </div>
        <div>
          <HomeFootnote />
        </div>
      </div>
    )
  }
}

export default WelcomeGuest
