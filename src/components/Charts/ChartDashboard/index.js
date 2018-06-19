// ChartDashboard/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.css'
var cloneDeep = require('lodash.clonedeep')

class ChartDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  render() {
    const symbol = this.props.cellObject.symbol
    const tradeside = this.props.cellObject.dashboard.tradeSide

    const session = this.props.cellObject.dashboard.session
    const duration = this.props.cellObject.dashboard.duration
    const orderType = this.props.cellObject.dashboard.orderType
    const quantityType = this.props.cellObject.dashboard.quantityType
    const quantity = this.props.cellObject.dashboard.quantity
    const instruction = this.props.cellObject.dashboard.instruction

    return (
      <div className="dashboard">
        <div className="dashboard-title">
          {symbol} - Dashboard For {tradeside}
        </div>
        <div className="dashboard-data">
          <span className="dashboard-header">Buy Order</span>
          <button className="place-order-button">PLACE ORDER</button>
          <form className="swing-buy-form">
            <label for="session">Session</label>
            <input type="text" name="session" value={session} />
            <label for="duration">Duration</label>
            <input type="text" name="duration" value={duration} />
            <br />
            <label for="quantity">Quantity</label>
            <input type="text" name="quantity" value={quantity} />

            <label for="quantityType">QuantityType</label>
            <input type="text" name="quantityType" value={quantityType} />
            <br />
            <label for="orderType">OrderType</label>
            <input type="text" name="orderType" value={orderType} />

            <label for="instruction">Instruction</label>
            <input type="text" name="instruction" value={instruction} />
          </form>
        </div>
      </div>
    )
  }
}
ChartDashboard.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

export default ChartDashboard
