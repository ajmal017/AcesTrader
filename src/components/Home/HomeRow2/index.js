import React, { Component } from 'react'
import picture from './example1.png'
import './styles.css'

class HomeRow2 extends Component {
  render() {
    return (
      <div className="home-row2">
        <div className="home-row2-item1">
          <div>
            <img src={picture} alt="PlanView" width="180" />
          </div>
          <div>
            <h5>Tree View Of Your Assets & Your Planned Transactions</h5>
          </div>
        </div>
        <div className="home-row2-item2">
          {/* <h2>Organize And Manage Your Plans.</h2>
          <p>
            Money Plan helps organize and manage your retirement and estate
            planning. Define persons included, and estate planning of gifts,
            insurance premiums to trusts, and beneficiary payouts.
          </p> */}
          {/* <h2>Test Your Financial Assumptions.</h2> */}
          <h2>Organize And Manage Your Plans.</h2>
          <p>
            Your financial data is shown in easily understood diagrams and
            tables. Asset details are easily modified. Quickly change assumed
            tax rates, inflation rates, and rates of return for a Money Plan
            test run.
          </p>
        </div>
      </div>
    )
  }
}
export default HomeRow2
