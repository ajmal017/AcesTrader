import React, { Component } from 'react'
import picture from './ipad-montecarlo-demo.png'
import './styles.css'

class HomeRow3 extends Component {
  render() {
    return (
      <div className="home-row3">
        <div className="home-row3-item1">
          <h2>Simulated Asset Performance Can Trigger Useful Conversations.</h2>
          <p>
            Define your financial assets and your plans for managing them over
            the life of your plan. Then run Money Plan to simulate the results.
          </p>
        </div>
        <div className="home-row3-item2">
          <img src={picture} alt="Monte Carlo Histogram" width="240" />
          <h5>Your Plan's Monte Carlo Simulation</h5>
        </div>
      </div>
    )
  }
}
export default HomeRow3
