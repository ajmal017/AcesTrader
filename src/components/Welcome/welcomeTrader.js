// WelcomeTrader.js

import React from 'react'
import './styles.css'

const WelcomeTrader = (reference) => {
  let cappedReference = reference.charAt(0).toUpperCase() + reference.slice(1)
  let spacedReference = cappedReference.replace('trader', ' Trader')

  return (
    <div className={'welcome-content'}>
      <h1>Welcome {spacedReference}</h1>
    </div>
  )
}
export default WelcomeTrader
