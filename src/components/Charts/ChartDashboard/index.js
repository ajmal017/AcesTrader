// ChartDashboard/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
// import uuidv4 from 'uuid/v4'
import { removeBuyFromList } from '../../../redux/reducerBuys'
import { removeSellFromList } from '../../../redux/reducerSells'
import { removeTrendBuyFromList } from '../../../redux/reducerTrendBuys'
import { addLongToList } from '../../../redux/reducerLongs'
import { addShortToList } from '../../../redux/reducerShorts'
import { addTrendLongToList } from '../../../redux/reducerTrendLongs'
import { removeLongFromList } from '../../../redux/reducerLongs'
import { removeShortFromList } from '../../../redux/reducerShorts'
import { removeTrendLongFromList } from '../../../redux/reducerTrendLongs'
import { addResultToList } from '../../../redux/reducerResults'
import PropTypes from 'prop-types'
import './styles.css'

class ChartDashboard extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    // this.handleDelete = this.handleDelete.bind(this)
    this.handleEntry = this.handleEntry.bind(this)
    this.state = {}
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleEntry(event) {
    // This is a newly entered position for this symbol
    event.preventDefault()

    // const hash = uuidv4() // use for unique object ID, instead of symbol (which may be repeated in Results)

    //TO DO
    //******Get the 2 filled prices, quantity, and account number from Ameritrade********
    const enteredPrice = 'pending' //100.52
    const exitedPrice = 'pending' //220.44
    const filledQuantity = 'pending' //55
    const theAccount = 'pending'

    switch (this.tradeSide.toUpperCase()) {
      case 'SWING BUYS': {
        this.props.dispatch(addLongToList(this.props.cellObject, enteredPrice, filledQuantity, theAccount))
        this.props.dispatch(removeBuyFromList(this.symbol))
        break
      }
      case 'SWING SHORT SALES': {
        this.props.dispatch(addShortToList(this.props.cellObject, enteredPrice, filledQuantity, theAccount))
        this.props.dispatch(removeSellFromList(this.symbol))
        break
      }
      case 'TREND BUYS': {
        this.props.dispatch(addTrendLongToList(this.props.cellObject, enteredPrice, filledQuantity, theAccount))
        this.props.dispatch(removeTrendBuyFromList(this.symbol))
        break
      }
      case 'SWING LONGS': {
        this.props.dispatch(addResultToList(this.props.cellObject, exitedPrice))
        this.props.dispatch(removeLongFromList(this.symbol))
        break
      }
      case 'SWING SHORTS': {
        this.props.dispatch(addResultToList(this.props.cellObject, exitedPrice))
        this.props.dispatch(removeShortFromList(this.symbol))
        break
      }
      case 'TREND LONGS': {
        this.props.dispatch(addResultToList(this.props.cellObject, exitedPrice))
        this.props.dispatch(removeTrendLongFromList(this.symbol))
        break
      }
      default:
        alert('ERROR3 Missing tradeSide in ChartDashboard')
      // debugger
    }
  }

  // handleDelete(event) {
  //   event.preventDefault()
  //   if (this.tradeSide.toUpperCase() === 'SWING BUYS') {
  //     this.props.dispatch(removeBuyFromList(this.symbol))
  //   } else if (this.tradeSide.toUpperCase() === 'SWING SHORT SALES') {
  //     this.props.dispatch(removeSellFromList(this.symbol))
  //   } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
  //     this.props.dispatch(removeTrendBuyFromList(this.symbol))
  //   } else {
  //     alert('ERROR3 Missing tradeSide in ChartDashboard')
  //     // debugger
  //   }
  // }

  render() {
    //handle new props with changed state of cellObjects
    this.symbol = this.props.cellObject.symbol
    this.watched = this.props.cellObject.watched
    this.entered = this.props.cellObject.entered
    this.enteredPrice = this.props.cellObject.enteredPrice
    this.filledquantity = this.props.cellObject.filledquantity
    this.account = this.props.cellObject.account
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
          <span className="dashboard-header">{this.tradeSide}</span>
          <form className="dashboard-form">
            <div className="events-log">
              <div>
                <span className="watched">Watched {this.watched}</span>
                {this.entered !== undefined ? (
                  <span className="entered">
                    Entered {this.entered}
                    &nbsp;&nbsp; Price {this.enteredPrice}
                  </span>
                ) : null}
              </div>
              <div>
                {this.filledquantity !== undefined ? (
                  <span className="filledquantity">
                    Quantity {this.filledquantity}
                    &nbsp;&nbsp; Account {this.account}
                  </span>
                ) : null}
              </div>
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
