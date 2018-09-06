// Chartcell/index.js

// Each Chartcell gets its chart price data from the IEX API
// and creates the chart display data
// Data provided for free by IEX. View IEX’s Terms of Use.
// See: https://iextrading.com/developer/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
import axios from 'axios'
import getChartData from '../../../lib/apiGetChartData'
import CandleStickChartWithMA from '../CandleStickChartWithMA'
import ChartDashboard from '../ChartDashboard'
import { putPriceData, getPriceData } from '../../../lib/chartDataCache'
import './styles.css'
var cloneDeep = require('lodash.clonedeep')

class Chartcell extends Component {
  constructor(props) {
    super(props)
    this.handleEntry = this.handleEntry.bind(this)
    this.handleOrderDispatch = this.handleOrderDispatch.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleDeleteDispatch = this.handleDeleteDispatch.bind(this)
    this.loadChartData = this.loadChartData.bind(this)
    this.values = null //array of price values from API call
    this.filteredValues = null //array of price values remaining after filter
    this.data = null
    this.state = {}
  }

  componentDidMount() {
    // first try to recover cached price data to avoid another http request
    this.data = cloneDeep(getPriceData(this.props.cellObject.symbol))
    if (this.data) {
      this.setState({ data: true, hide: false }) //data is available in cache
    } else {
      this.loadChartData()
    }
  }

  loadChartData = () => {
    const symbol = this.props.cellObject.symbol
    const range = '1y'
    const self = this
    getChartData(symbol, range)
      .then(function(data) {
        putPriceData(symbol, data) //cache the price data for subsequent rendering
        self.setState({ data: true, hide: false }) //triggers render using the cached data
      })
      .catch(function(error) {
        console.log('getChartData axios error:', error.message)
        alert('getChartData axios error: ' + error.message) //rude interruption to user
      })
  }

  handleEntry(event) {
    event.preventDefault()
    // fade-out this object before dispatching redux action, which will snap in revised display
    this.setState({ hide: true })
    setTimeout(this.handleOrderDispatch, 200)
  }

  handleOrderDispatch() {
    // This is a newly opened position or a newly closed position for this symbol
    this.setState({ hide: false })
    //TO DO Use - THUNK to fetch price for specified SYM and specified hash id.
    //******Get the 2 filled prices, quantity, and account number from Ameritrade********
    const enteredPrice = 'pending' //100.52
    const exitedPrice = 'pending' //220.44
    const filledQuantity = 'pending' //55
    const theAccount = 'pending'

    switch (this.tradeSide.toUpperCase()) {
      case 'SWING BUYS': {
        this.props.dispatch(addLongToList(this.props.cellObject, enteredPrice, filledQuantity, theAccount))
        this.props.dispatch(removeBuyFromList(this.symbol, this.hash))
        break
      }
      case 'SWING SHORT SALES': {
        this.props.dispatch(addShortToList(this.props.cellObject, enteredPrice, filledQuantity, theAccount))
        this.props.dispatch(removeSellFromList(this.symbol, this.hash))
        break
      }
      case 'TREND BUYS': {
        this.props.dispatch(addTrendLongToList(this.props.cellObject, enteredPrice, filledQuantity, theAccount))
        this.props.dispatch(removeTrendBuyFromList(this.symbol, this.hash))
        break
      }
      case 'SWING LONGS': {
        this.props.dispatch(addResultToList(this.props.cellObject, exitedPrice))
        this.props.dispatch(removeLongFromList(this.symbol, this.hash))
        break
      }
      case 'SWING SHORTS': {
        this.props.dispatch(addResultToList(this.props.cellObject, exitedPrice))
        this.props.dispatch(removeShortFromList(this.symbol, this.hash))
        break
      }
      case 'TREND LONGS': {
        this.props.dispatch(addResultToList(this.props.cellObject, exitedPrice))
        this.props.dispatch(removeTrendLongFromList(this.symbol, this.hash))
        break
      }
      default:
        alert('ERROR2 Missing tradeSide in Chartcell')
      // debugger
    }
  }

  handleDelete(event) {
    event.preventDefault()
    // fade-out this object before dispatching redux action, which will snap in revised display
    this.setState({ hide: true })
    setTimeout(this.handleDeleteDispatch, 200)
  }

  handleDeleteDispatch() {
    this.setState({ hide: false })
    if (this.tradeSide.toUpperCase() === 'SWING BUYS') {
      this.props.dispatch(removeBuyFromList(this.symbol, this.hash))
    } else if (this.tradeSide.toUpperCase() === 'SWING SHORT SALES') {
      this.props.dispatch(removeSellFromList(this.symbol, this.hash))
    } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
      this.props.dispatch(removeTrendBuyFromList(this.symbol, this.hash))
    } else {
      alert('ERROR3 Missing tradeSide in Chartcell')
      // debugger
    }
  }

  render() {
    const cellObject = this.props.cellObject
    this.tradeSide = cellObject.dashboard.tradeSide
    this.symbol = cellObject.symbol
    this.hash = cellObject.hash
    this.instruction = cellObject.dashboard.instruction
    // this.buttonLabel = cellObject.dashboard.buttonLabel
    this.entered = cellObject.entered
    const chart_name = cellObject.symbol
    const cell_id = cellObject.hash
    const wrapperId = 'wrapper-' + cell_id
    const chartId = 'chart-' + cell_id

    //Cached storage holds price data (no change until program is restarted)
    //Cached storage holds indicator values used for signal alerts)
    //Local state holds duplicate of price data)

    if (this.state.noprices) {
      return (
        <div id={cell_id} className="chart-cell-wrapper">
          <h4>{`No 1-day Prices Available For ${chart_name}.`}</h4>
        </div>
      )
    }

    if (!this.state.data) {
      return (
        <div className="chart-cell-wrapper">
          <h4>{`Loading Chart ${chart_name}. Please Wait...`}</h4>
        </div>
      )
    }

    // A re-render can happen without life cycle calls when a list item is deleted,
    // so we make sure we have the corrent data for the new current symbol
    this.data = cloneDeep(getPriceData(this.props.cellObject.symbol))

    return (
      <div id={wrapperId} className={`chart-cell-wrapper ${this.state.hide ? 'fadeout' : ''}`}>
        {/* the Chartcell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
        <div id={cell_id} className="chart-cell">
          <div className="cell-header">
            <span className="cell-title">{chart_name}</span>
            {/* if entered is undefined, this is a Prospects list, so the X delete button is added */}
            {this.entered === undefined ? (
              <button onClick={this.handleDelete} className="cell-button" type="button" aria-label="delete">
                &times;
              </button>
            ) : null}
          </div>
          <div id={chartId} className="graph-content">
            <CandleStickChartWithMA chartId={chartId} data={this.data} symbol={chart_name} />
          </div>
          <div className="dashboard-center">
            <ChartDashboard handleEntry={this.handleEntry} cellObject={cellObject} />
          </div>

          {/* <div className="dashboard-footer">
            <div className="order-entry-button">
              <button onClick={this.handleEntry} className="entry-order-button">
                {this.buttonLabel} {this.symbol}
              </button>
            </div>
          </div> */}
        </div>
      </div>
    )
  }
}

Chartcell.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
const mapStateToProps = (state) => ({
  state: state,
})
export default connect(mapStateToProps)(Chartcell)
