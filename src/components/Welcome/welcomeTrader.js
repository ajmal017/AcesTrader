// WelcomeTrader.js

import React from 'react'
import './styles.css'

const WelcomeTrader = (reference) => {
  let CappedReference = reference.charAt(0).toUpperCase() + reference.slice(1)

  return (
    <div>
      <h1>Welcome {CappedReference}</h1>
      {/* <HomeContent /> */}
    </div>
  )
}
export default WelcomeTrader
