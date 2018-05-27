import React, { Component } from 'react'
import picture from './moneyplan-imac.png'
import './styles.css'

class HomeRow1 extends Component {
  render() {
    return (
      <div className="home-row1">
        <div className="home-row1-item1">
          <h2>Money Plans Are Tested & Charted... Fast.</h2>
          <p>
            Do your planning and see how the compounding of inflation, taxes and
            earnings can affect your assets over your life time.{' '}
          </p>
        </div>
        <div className="home-row1-item2">
          <img src={picture} alt="iMac" width="190" />
          <h5>Your Yearly Cash Flow In Charts & Tables</h5>
        </div>
      </div>
    )
  }
}
export default HomeRow1
