// WelcomeTrader.js

import React from 'react'
import { AuthenticatedContext } from '../../redux'
import HomeJumbotron from '../Home/HomeJumbotron'
import HomeFootnote from '../Home/HomeFootnote'
import './styles.css'

const WelcomeTrader = (reference) => {
  let contextType = AuthenticatedContext
  // let currentUser = context

  let cappedReference = reference.charAt(0).toUpperCase() + reference.slice(1)
  let spacedReference = cappedReference.replace('trader', ' Trader')

  return (
    <div>
      <HomeJumbotron />
      <div className={'welcome-content'}>
        <h1>Welcome {spacedReference}</h1>
      </div>
      <HomeFootnote />
    </div>
  )
}
export default WelcomeTrader
