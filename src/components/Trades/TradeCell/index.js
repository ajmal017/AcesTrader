//TradeCell/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { querydeleteTradeObject } from '../../../redux/reducerModal'
import { removeResultFromList } from '../../../redux/reducerResults'
import './styles.css'

class TradeCell extends Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleDeleteQueryResonse = this.handleDeleteQueryResonse.bind(this)
    this.handleDispatch = this.handleDispatch.bind(this)
    this.state = {}
  }

  handleDelete(event) {
    event.preventDefault()
    this.props.dispatch(querydeleteTradeObject(this.handleDeleteQueryResonse))
  }

  handleDeleteQueryResonse(response) {
    let buttonFlag = response.buttonFlag
    if (buttonFlag === 'yes') {
      // fade-out this object before dispatching redux action, which will snap in revised display
      this.setState({ hide: true })
      setTimeout(this.handleDispatch, 500)
    }
  }

  handleDispatch() {
    this.setState({ hide: false })
    this.props.dispatch(removeResultFromList(this.props.tradeObject.hash))
  }

  render() {
    const tradeObject = this.props.tradeObject
    const symbol = tradeObject.symbol
    const watchDate = tradeObject.watched
    const enterDate = tradeObject.entered
    const exitDate = tradeObject.exited
    const tradeSide = tradeObject.dashboard.tradeSide
    const enterPrice = tradeObject.enteredPrice
    const exitPrice = tradeObject.exitedPrice
    const tradeQuantity = tradeObject.filledquantity
    const tradePercentGain = exitPrice !== 'pending' ? (100 * (exitPrice - enterPrice)) / enterPrice + '%' : 'pending'
    // const tradeDollarGain = exitPrice !== 'pending' ? tradeQuantity * (exitPrice - enterPrice) : 'pending'
    // const tradeGain = exitPrice !== 'pending' ? (100 * (exitPrice - enterPrice)) / enterPrice + '%' : 'pending'
    const account = tradeObject.account
    const cell_id = tradeObject.hash
    const wrapperId = 'wrapper-' + cell_id

    return (
      <div id={wrapperId} className={`trade-cell-wrapper ${this.state.hide ? 'fadeout' : ''}`}>
        {/* the TradCell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
        <div id={cell_id} className="trade-cell">
          <div className="trade-header">
            <span className="trade-title-formatting">{symbol}</span>
            <span className="tradeside-formatting">Trade: {tradeSide}</span>
            <button onClick={this.handleDelete} className="trade-button" type="button" aria-label="delete">
              &times;
            </button>
          </div>
          <p>
            Account: {account}, Quantity: {tradeQuantity}
          </p>
          <p>
            Watched: {watchDate}, Entered: {enterDate}, Exited: {exitDate}
          </p>
          <p>
            Entered Price: {enterPrice}, Exit Price: {exitPrice}, Gain %: {tradePercentGain}
          </p>
        </div>
      </div>
    )
  }
}

TradeCell.propTypes = {
  tradeObject: PropTypes.object.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
const mapStateToProps = (state) => ({
  state: state,
})
export default connect(mapStateToProps)(TradeCell)
