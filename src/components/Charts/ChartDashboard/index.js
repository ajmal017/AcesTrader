// ChartDashboard/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.css'

// &nbsp; ${dollarGain}
function PeekStatusLine({hash, listGroup, peekDate, peekPrice, dollarGain, percentGain, positionValue }) {
  return peekDate !== undefined && listGroup === 'prospects' ? (
    <div>
      <span id={'prospects'+hash} className="watched">
        Peek {peekDate} @{peekPrice}, &nbsp;&nbsp; Change:&nbsp; {percentGain}%
      </span>
    </div>
  ) : peekDate !== undefined && listGroup === 'positions' ? (
    <div>
      <span id={'positions'+hash} className="watched">
        Peek {peekDate} @{peekPrice},&nbsp;&nbsp; Change:&nbsp; {percentGain}%,&nbsp;&nbsp; Value:&nbsp; ${positionValue}
      </span>
    </div>
  ) : null
}

// this.percentGain = exitPrice !== 'pending' ? ((100 * (exitPrice - enterPrice)) / enterPrice).toFixed(1) : 'pending'
// this.dollarGain = exitPrice !== 'pending' ? ((exitPrice - enterPrice)).toFixed(0) : 'pending'
// this.valueGain = exitPrice !== 'pending' ? (filledQuantity * (exitPrice - enterPrice)).toFixed(0) : 'pending'

// <span id={'peekinfo'}>
// {dollarGain < 0 ? '-' : ''} ${this.numberWithCommas(dollarGain)}
// &nbsp;&nbsp;&nbsp;&nbsp; {dollarGain < 0 ? '-' : ''} {this.percentGain}%{/*&nbsp;&nbsp;&nbsp;&nbsp;  Account: {account}  */}
// </span>

class ChartDashboard extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {}
  }

  componentDidMount() {
    let rgbColor = this.percentGain > 0 ? '0,255,0' : '255,0,0'
    // let rgbOpacity = Math.min(Math.abs(this.tradePercentGain / 100) * 6, 0.6)
    let rgbOpacity = Math.min(Math.abs(this.percentGain / 100) * 20, 0.8)
    let el = document.getElementById(this.listGroup+this.hash)
    el.setAttribute('style', `background-color: rgba(${rgbColor}, ${rgbOpacity})`)
  }

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  render() {
    //handle new props with changed state of cellObjects
    this.hash = this.props.cellObject.hash
    this.symbol = this.props.cellObject.symbol
    this.listGroup = this.props.cellObject.listGroup
    this.peekDate = this.props.cellObject.peekDate
    this.peekPrice = this.props.cellObject.peekPrice
    this.watched = this.props.cellObject.watched
    this.watchedPrice = this.props.cellObject.watchedPrice
    this.entered = this.props.cellObject.entered
    this.enteredPrice = this.props.cellObject.enteredPrice
    this.filledQuantity = this.props.cellObject.filledQuantity
    this.percentGain = this.props.cellObject.percentGain
    this.account = this.props.cellObject.account
    this.tradeSide = this.props.cellObject.dashboard.tradeSide
    this.session = this.props.cellObject.dashboard.session
    this.duration = this.props.cellObject.dashboard.duration
    this.orderType = this.props.cellObject.dashboard.orderType
    this.quantityType = this.props.cellObject.dashboard.quantityType
    this.quantity = this.props.cellObject.dashboard.quantity
    this.instruction = this.props.cellObject.dashboard.instruction
    this.buttonLabel = this.instruction // this.props.cellObject.dashboard.buttonLabel

    const startPrice = this.listGroup==='positions' ? this.enteredPrice : this.watchedPrice
    this.dollarGain = this.peekDate !== undefined ? (this.peekPrice - startPrice).toFixed(2) : 'pending'
    this.percentGain = this.peekDate !== undefined ? ((100 * (this.peekPrice - startPrice)) / startPrice).toFixed(1) : 'pending'
    this.positionValue = this.peekDate !== undefined ? this.numberWithCommas((this.filledQuantity * (this.peekPrice)).toFixed(0)) : 'pending'

return (
      <div className="dashboard">
        <div className="dashboard-data">
          <span className="dashboard-header">{this.tradeSide}</span>
          <form className="dashboard-form">
            <div className="events-log">
              <PeekStatusLine hash={this.hash} listGroup={this.listGroup} peekDate={this.peekDate} peekPrice={this.peekPrice} dollarGain={this.dollarGain} percentGain={this.percentGain} positionValue={this.positionValue} />
 
 
              {/* {this.peekDate !== undefined && (this.entered !== undefined || this.watched !== undefined) ? (
                <div>
                  <span className="watched">
                    Peek {this.peekDate}
                    &nbsp;&nbsp; @ {this.peekPrice}
                  </span>
                </div>
              ) : null} */}

              <div>
                <span className="watched">
                  Watched {this.watched} @{this.watchedPrice}
                </span>
                {this.entered !== undefined ? (
                  <span className="entered">
                    Entered {this.entered}
                    &nbsp;&nbsp; Price {this.enteredPrice}
                  </span>
                ) : null}
                {/* </div>
              <div> */}
                {this.filledQuantity !== undefined ? (
                  <span className="filledquantity">
                    Quantity {this.filledQuantity}
                    {/* &nbsp;&nbsp; Account {this.account} */}
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

          <div className="dashboard-footer">
            <div className="order-entry-button">
              <button onClick={this.props.handleEntry} className="entry-order-button">
                {this.buttonLabel} {this.symbol}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ChartDashboard.propTypes = {
  handleEntry: PropTypes.func.isRequired,
  cellObject: PropTypes.object.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(ChartDashboard)
