// ChartDashboard/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { removeBuyFromList } from '../../../redux/reducerBuys'
import { removeSellFromList } from '../../../redux/reducerSells'
import { removeTrendBuyFromList } from '../../../redux/reducerTrendBuys'
import { addLongToList } from '../../../redux/reducerLongs'
import PropTypes from 'prop-types'
import './styles.css'

class ChartDashboard extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleEntry = this.handleEntry.bind(this)
    this.state = {}
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleEntry(event) {
    event.preventDefault()
    if (this.tradeSide.toUpperCase() === 'SWING BUYS') {
      this.props.dispatch(addLongToList(this.props.cellObject))
      this.props.dispatch(removeBuyFromList(this.symbol))
    } else if (this.tradeSide.toUpperCase() === 'SWING SHORT SALES') {
      this.props.dispatch(removeSellFromList(this.symbol))
    } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
      this.props.dispatch(removeTrendBuyFromList(this.symbol))
    } else {
      alert('ERROR3 Missing tradeSide in ChartDashboard')
      // debugger
    }
  }

  handleDelete(event) {
    event.preventDefault()
    if (this.tradeSide.toUpperCase() === 'SWING BUYS') {
      this.props.dispatch(removeBuyFromList(this.symbol))
    } else if (this.tradeSide.toUpperCase() === 'SWING SHORT SALES') {
      this.props.dispatch(removeSellFromList(this.symbol))
    } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
      this.props.dispatch(removeTrendBuyFromList(this.symbol))
    } else {
      alert('ERROR3 Missing tradeSide in ChartDashboard')
      // debugger
    }
  }

  render() {
    //handle new props with changed state of cellObjects
    this.watched = this.props.cellObject.watched
    this.entered = this.props.cellObject.entered
    this.symbol = this.props.cellObject.symbol
    this.tradeSide = this.props.cellObject.dashboard.tradeSide
    this.session = this.props.cellObject.dashboard.session
    this.duration = this.props.cellObject.dashboard.duration
    this.orderType = this.props.cellObject.dashboard.orderType
    this.quantityType = this.props.cellObject.dashboard.quantityType
    this.quantity = this.props.cellObject.dashboard.quantity
    this.instruction = this.props.cellObject.dashboard.instruction
    return (
      <div className="dashboard">
        <div className="dashboard-data">
          <span className="dashboard-header">{this.instruction} Alert: (-not working yet-)</span>
          <form className="dashboard-form">
            <div className="events-log">
              <span className="watched">Watched {this.watched}</span>
              {this.entered !== undefined ? <span className="entered">Entered {this.entered}</span> : null}
            </div>
            <label htmlFor="session">Session</label>
            <input type="text" name="session" value={this.session} onChange={this.handleChange} />
            <label htmlFor="instruction">Instruction</label>
            <input type="text" name="instruction" value={this.instruction} onChange={this.handleChange} />
            <br />
            <label htmlFor="quantity">Quantity</label>
            <input type="text" name="quantity" value={this.quantity} onChange={this.handleChange} />
            <label htmlFor="quantityType">QuantityType</label>
            <input type="text" name="quantityType" value={this.quantityType} onChange={this.handleChange} />
            <br />
            <label htmlFor="orderType">OrderType</label>
            <input type="text" name="orderType" value={this.orderType} onChange={this.handleChange} />
            <label htmlFor="duration">Duration</label>
            <input type="text" name="duration" value={this.duration} onChange={this.handleChange} />
          </form>
          <div className="dashboard-buttons">
            <button onClick={this.handleEntry} className="entry-order-button">
              {this.instruction} {this.symbol}
            </button>
            {this.entered === undefined ? (
              <button onClick={this.handleDelete} className="delete-prospect-button">
                DELETE
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
ChartDashboard.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(ChartDashboard)
