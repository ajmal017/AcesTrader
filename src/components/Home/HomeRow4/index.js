import React, { Component } from 'react'
// import picture from './dell-300-426.png'
import picture from './piechart.png'
import './styles.css'

class HomeRow4 extends Component {
  render() {
    return (
      <div className="home-row4">
        <div className="home-row4-item1">
          <div>
            <img src={picture} alt="dellnotebook" width="180" />
          </div>
          <div>
            <h5>Pie Chart With Your Estate Plan Results</h5>
          </div>
        </div>
        <div className="home-row4-item2">
          {/* <h2>Test Your Financial Assumptions.</h2>
          <p>
            Your financial data is shown in easily understood diagrams and
            tables. Asset details are easily modified. Quickly change assumed
            tax rates, inflation rates, and rates of return for a Money Plan
            test run.
          </p> */}
          {/* <h2>Organize And Manage Your Plans.</h2> */}
          <h2>Test Your Financial Assumptions.</h2>
          <p>
            Money Plan helps organize and manage your retirement and estate
            planning. Define persons included, and estate planning of gifts,
            insurance premiums to trusts, and beneficiary payouts.
          </p>
        </div>
      </div>
    )
  }
}
export default HomeRow4
