//TradeCell/index.js

// The Result TradeCell is unique.
// It displays a bar chart of all trade results
// and a summary data Dashboard for each trade.

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import TradeChart from '../TradeChart'
import TradeDashboard from '../TradeDashboard'
import { putPriceData, getPriceData } from '../../../lib/chartDataCache'
import './styles.css'
var cloneDeep = require('lodash.clonedeep')

class TradeCell extends Component {
  // constructor(props) {
  //   super(props)
  //   this.loadTradeData = this.loadTradeData.bind(this)
  //   this.state = {}
  // }

  // componentDidMount() {
  //   // first try to recover cached price data to avoid another http request
  //   let data = cloneDeep(getPriceData(this.props.cellObject.symbol))
  //   if (data) {
  //     this.setState({ data })
  //   } else {
  //     this.loadTradeData()
  //   }
  // }

  render() {
    const cellObject = this.props.cellObject
    const resultsData = this.props.resultsData
    const symbol = this.props.cellObject.symbol
    const tradeside = this.props.cellObject.dashboard.tradeSide
    const trade_name = cellObject.symbol
    const cell_id = trade_name.replace(/[\W_]/g, '')
    const tradeId = cell_id + 'trade'

    return (
      <div className="trade-cell-wrapper">
        {/* the TradeCell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
        <div id={cell_id} className="trade-cell">
          <div className="trade-content">
            <TradeChart data={resultsData} />
          </div>

          <div className="trade-dashboard-title">
            {symbol} - {tradeside}
          </div>

          <div className="trade-dashboard-center">
            <TradeDashboard handleClick={this.props.handleClick} cellObject={cellObject} />
          </div>
        </div>
      </div>
    )
  }
}

TradeCell.propTypes = {
  cellObject: PropTypes.object.isRequired,
  resultsData: PropTypes.object.isRequired,
}

export default TradeCell
