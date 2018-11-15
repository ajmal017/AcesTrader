//TradeCell/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { querydeleteTradeObject } from '../../../redux/reducerModal'
import { removeResultFromList } from '../../../redux/reducerResults'
import './styles.css'

// {/* <span id={'gaininfo'}>
//   {tradeDollarGain < 0 ? 'Loss' : 'Gain'} &nbsp;&nbsp;&nbsp; ${this.numberWithCommas(tradeDollarGain)}
//   &nbsp;&nbsp;&nbsp;&nbsp; {this.tradePercentGain}%{/*&nbsp;&nbsp;&nbsp;&nbsp;  Account: {account}  */}
// </span>  */}>

function TradeStatusLine({ hash, tradeSide, tradeDollarGain, tradePercentGain }) {
  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return tradeSide === 'Swing Shorts' ? (
    <div>
      <span id={'gaininfo' + hash} className="watched">
        {tradeDollarGain > 0 ? 'Loss' : 'Gain'} &nbsp;&nbsp;&nbsp; {tradeDollarGain > 0 ? '-' : ''}${numberWithCommas(Math.abs(tradeDollarGain))}
        &nbsp;&nbsp;&nbsp;&nbsp; {tradePercentGain}%
      </span>
    </div>
  ) : (
    <div>
      <span id={'gaininfo' + hash} className="watched">
        {tradeDollarGain < 0 ? 'Loss' : 'Gain'} &nbsp;&nbsp;&nbsp; {tradeDollarGain < 0 ? '-' : ''}${numberWithCommas(Math.abs(tradeDollarGain))}
        &nbsp;&nbsp;&nbsp;&nbsp; {tradePercentGain}%
      </span>
    </div>
  )
}

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
      setTimeout(this.handleDispatch, 400)
    }
  }

  handleDispatch() {
    this.setState({ hide: false })
    this.props.dispatch(removeResultFromList(this.props.tradeObject.hash))
  }

  componentDidMount() {
    let el = document.getElementById('gaininfo' + this.hash)
    if (el !== null) {
      let rgbColor = this.tradePercentGain > 0 ? '0,255,0' : '255,107,107'
      let rgbOpacity = Math.min(Math.abs(this.tradePercentGain / 100) * 20, 0.8)
      el.setAttribute('style', `background-color: rgba(${rgbColor}, ${rgbOpacity})`)
    }
  }

  // this.tradePercentGain > 0 ? 0.8 : 0.6  // 250,82,82

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  render() {
    const tradeObject = this.props.tradeObject
    this.hash = tradeObject.hash
    this.listGroup = tradeObject.listGroup
    const symbol = tradeObject.symbol
    const watchDate = tradeObject.watched
    const enterDate = tradeObject.entered
    const exitDate = tradeObject.exited
    this.tradeSide = tradeObject.dashboard.tradeSide
    const enterPrice = tradeObject.enteredPrice
    const exitPrice = tradeObject.exitedPrice
    const filledQuantity = tradeObject.filledQuantity
    this.tradePercentGainTemp = exitPrice !== 'pending' ? ((100 * (exitPrice - enterPrice)) / enterPrice).toFixed(1) : 'pending'
    this.tradePercentGain = this.tradeSide === 'Swing Shorts' ? -this.tradePercentGainTemp : this.tradePercentGainTemp
    this.tradeDollarGain = exitPrice !== 'pending' ? (filledQuantity * (exitPrice - enterPrice)).toFixed(0) : 'pending'
    // const tradeGain = exitPrice !== 'pending' ? (100 * (exitPrice - enterPrice)) / enterPrice + '%' : 'pending'
    // const account = tradeObject.account
    const cell_id = tradeObject.hash
    const wrapperId = 'wrapper-' + cell_id

    return (
      <div id={wrapperId} className={`trade-cell-wrapper ${this.state.hide ? 'fadeout' : ''}`}>
        {/* the TradCell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
        <div id={cell_id} className="trade-cell">
          <div className="trade-header">
            <span className="trade-title-formatting">{symbol}</span>
            <span className="tradeside-formatting">Trade: {this.tradeSide}</span>
            <button onClick={this.handleDelete} className="trade-button" type="button" aria-label="delete">
              &times;
            </button>
          </div>
          <TradeStatusLine hash={this.hash} tradeSide={this.tradeSide} tradeDollarGain={this.tradeDollarGain} tradePercentGain={this.tradePercentGain} />
          {/* <span id={'gaininfo'}>
            {tradeDollarGain < 0 ? 'Loss' : 'Gain'} &nbsp;&nbsp;&nbsp; ${this.numberWithCommas(tradeDollarGain)}
            &nbsp;&nbsp;&nbsp;&nbsp; {this.tradePercentGain}%
          </span>  */}
          <span>
            Enter Price: {enterPrice}
            &nbsp;&nbsp;&nbsp; Exit Price: {exitPrice}
            &nbsp;&nbsp;&nbsp; Quantity: {filledQuantity}
          </span>
          <span>
            Watched: {watchDate}
            &nbsp;&nbsp;&nbsp; Entered: {enterDate}
            &nbsp;&nbsp;&nbsp; Exited: {exitDate}
          </span>
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
