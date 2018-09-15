// Welcome/index.js

import React, { Component } from 'react'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import HomeJumbotron from '../../components/Home/HomeJumbotron'
import welcomeDemoTrader from './welcomeDemoTrader'
import welcomeTrader from './welcomeTrader'
import HomeFootnote from '../../components/Home/HomeFootnote'
import './styles.css'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.reference = null // identifies the DB source for the app's store
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    this.reference = getReference() //indicates user's role
    return (
      <div>
        <div>
          <HomeJumbotron />
        </div>
        <div className={'welcome-content'}>{this.reference === referenceLocaltrader ? welcomeDemoTrader() : welcomeTrader(this.reference)}</div>
        <div>
          <HomeFootnote />
        </div>
      </div>
    )
  }
}

export default Welcome
