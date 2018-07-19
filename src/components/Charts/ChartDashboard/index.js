// ChartDashboard/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

class ChartDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

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
          <span className="dashboard-header">{instruction} Order</span>
          <form className="swing-buy-form">
            <label htmlFor="session">Session</label>
            <input type="text" name="session" value={session} onChange={this.handleChange} />
            <label htmlFor="duration">Duration</label>
            <input type="text" name="duration" value={duration} onChange={this.handleChange} />
            <br />
            <label htmlFor="quantity">Quantity</label>
            <input type="text" name="quantity" value={quantity} onChange={this.handleChange} />

            <label htmlFor="quantityType">QuantityType</label>
            <input type="text" name="quantityType" value={quantityType} onChange={this.handleChange} />
            <br />
            <label htmlFor="orderType">OrderType</label>
            <input type="text" name="orderType" value={orderType} onChange={this.handleChange} />

            <label htmlFor="instruction">Instruction</label>
            <input type="text" name="instruction" value={instruction} onChange={this.handleChange} />
          </form>
          <button className="place-order-button">PLACE {instruction} ORDER</button>
        </div>
      </div>
    )
  }
}
ChartDashboard.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

export default ChartDashboard
