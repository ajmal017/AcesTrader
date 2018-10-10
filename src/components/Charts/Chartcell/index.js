// Chartcell/index.js

// Each Chartcell gets its chart price data from the IEX API
// and creates the chart display data
// Data provided for free by IEX. View IEX’s Terms of Use.
// See: https://iextrading.com/developer/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ErrorBoundaryChart from '../../../components/ErrorBoundaryChart/'
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
import { addEnterPriceAsync, addExitPriceAsync } from '../../../redux/thunkEditListObjects'
import getChartData from '../../../lib/apiGetChartData'
// import getChartLastBar from '../../../lib/apigetChartLastBar'
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
    // this.getLastBar = this.getLastBar.bind(this)
    this.values = null //array of price values from API call
    this.filteredValues = null //array of price values remaining after filter
    this.data = null
    this.dynamicCounter = 0
    // this.state = { dynamicCounter: this.dynamicCounter }
    this.state = { lastBar: {} }
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
    // console.log('loadChartData ' + symbol)
    getChartData(symbol, range)
      .then(function(data) {
        if (data.length < 2) {
          //CandleStickChartWithMA bug seen with new issue "TRTY" when only 0 or 1 day's data available
          //Memory leak reported by VSCode, seems to cause many weird code mistakes when running
          self.setState({ data: true, noprices: true, hide: false })
        } else {
          putPriceData(symbol, data) //cache the price data for subsequent rendering
          self.setState({ data: true, hide: false }) //triggers render using the cached data
        }
      })
      .catch(function(error) {
        console.log('getChartData axios error:', error.message)
        // Rare occasional error.message seen: "undefined is not an object (evaluating 'e.axes') ".
        // so we are replacing the alert() with the setState() to allow the program to continue.
        // Retrying may work, but not tested yet.
        self.setState({ data: true, noprices: true, hide: false })
        // alert('getChartData axios error: ' + error.message) //rude interruption to user
      })
  }

  // getLastBar = () => {
  //   const symbol = this.props.cellObject.symbol
  //   const range = 'dynamic'
  //   const self = this
  //   // console.log('getChartLastBar ' + symbol)
  //   getChartLastBar(symbol, range)
  //     .then(function(data) {
  //       if (data.length) {
  //         let barClose = null
  //         let barHigh = 0
  //         let barLow = 10000000
  //         let barVolume = 0
  //         data.forEach((obj) => {
  //           if (obj.high > 3) {
  //             barClose = obj.close
  //             barHigh = obj.high > barHigh ? obj.high : barHigh
  //             barLow = obj.low < barLow ? obj.low : barLow
  //             barVolume = +obj.volume
  //           }
  //         })
  //         let barOpen = +((barHigh + barLow) / 2).toFixed(2)
  //         // TODO Use this bar in Chart
  //         // let lastBar = { close: barClose, date: '', high: barHigh, low: barLow, open: barOpen, volume: barVolume }
  //         self.setState({ dynamicCounter: ++self.dynamicCounter })
  //       } else {
  //         // putPriceData(symbol, data) //cache the price data for subsequent rendering
  //         // self.setState({ data: true, hide: false }) //triggers render using the cached data
  //       }
  //     })
  //     .catch(function(error) {
  //       console.log('getChartData axios error:', error.message)
  //       alert('getChartData axios error: ' + error.message) //rude interruption to user
  //     })
  // }

  handleEntry(event) {
    event.preventDefault()
    // fade-out this object before dispatching redux action,
    // which will remove this object and then
    // will snap in new object and reset all props.
    this.setState({ hide: true })
    setTimeout(this.handleOrderDispatch, 200)
  }

  handleOrderDispatch() {
    // This is a newly opened position or a newly closed position for this symbol
    this.setState({ hide: false })
    // Use thunk to async fetch price (when available) for the specified hash id object.
    // Get the 2 filled prices, quantity, and account number from Ameritrade********
    const enteredPrice = 'pending'
    const exitedPrice = 'pending'
    const theAccount = 'pending'
    const theCellObject = this.props.cellObject //the target object originating the dispatch action
    const filledQuantity = this.props.cellObject.dashboard.quantity //will be revised if quantityType==='DOLLARS'
    const enteredQuantityType = this.props.cellObject.dashboard.quantityType
    // theCellObject.enterQuantity = this.props.cellObject.dashboard.quantity //from target object before its removal by dispatch below
    const theHash = this.props.cellObject.hash //from target object before its removal by dispatch below

    switch (this.tradeSide.toUpperCase()) {
      case 'SWING BUYS': {
        this.props.dispatch(addLongToList(theCellObject, enteredPrice, filledQuantity, enteredQuantityType, theAccount))
        this.props.dispatch(removeBuyFromList(this.symbol, this.hash))
        this.props.dispatch(addEnterPriceAsync(theHash))
        break
      }
      case 'SWING SHORT SALES': {
        this.props.dispatch(addShortToList(theCellObject, enteredPrice, filledQuantity, enteredQuantityType, theAccount))
        this.props.dispatch(removeSellFromList(this.symbol, this.hash))
        this.props.dispatch(addEnterPriceAsync(theHash))
        break
      }
      case 'TREND BUYS': {
        this.props.dispatch(addTrendLongToList(theCellObject, enteredPrice, filledQuantity, enteredQuantityType, theAccount))
        this.props.dispatch(removeTrendBuyFromList(this.symbol, this.hash))
        this.props.dispatch(addEnterPriceAsync(theHash))
        break
      }
      case 'SWING LONGS': {
        this.props.dispatch(addResultToList(theCellObject, exitedPrice))
        this.props.dispatch(removeLongFromList(this.symbol, this.hash))
        this.props.dispatch(addExitPriceAsync(theHash))
        break
      }
      case 'SWING SHORTS': {
        this.props.dispatch(addResultToList(theCellObject, exitedPrice))
        this.props.dispatch(removeShortFromList(this.symbol, this.hash))
        this.props.dispatch(addExitPriceAsync(theHash))
        break
      }
      case 'TREND LONGS': {
        this.props.dispatch(addResultToList(theCellObject, exitedPrice))
        this.props.dispatch(removeTrendLongFromList(this.symbol, this.hash))
        this.props.dispatch(addExitPriceAsync(theHash))
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

    // if (this.state.noprices) {
    //   return (
    //     <div id={cell_id} className="chart-cell-wrapper">
    //       <h4>{`No Prices Available For ${chart_name}.`}</h4>
    //     </div>
    //   )
    // }

    if (!this.state.data) {
      return (
        <div className="chart-cell-wrapper">
          <h4>{`Loading Chart ${chart_name}. Please Wait...`}</h4>
        </div>
      )
    }

    // A re-render will happen without life cycle calls when a list item is deleted,
    // so we make sure we have the corrent data for the new current symbol
    this.data = cloneDeep(getPriceData(this.props.cellObject.symbol))

    return (
      <div id={wrapperId} className={`chart-cell-wrapper ${this.state.hide ? 'fadeout' : ''}`}>
        {/* the Chartcell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
        <div id={cell_id} className="chart-cell">
          <div className="cell-header">
            <span className="cell-title">{chart_name}</span>
            {/* <button onClick={this.getLastBar} className="cell-getlast-button" type="button" aria-label="getlast">
              Get Last
            </button> */}
            {/* if entered is undefined, this is still in a Prospects list, so the X delete button is added */}
            {this.entered === undefined ? (
              <button onClick={this.handleDelete} className="cell-button" type="button" aria-label="delete">
                &times;
              </button>
            ) : null}
          </div>
          <div id={chartId} className="graph-content">
            {this.state.noprices ? (
              <div id={cell_id} className="chart-cell-wrapper">
                {' '}
                <h4>{`No Prices Available For ${chart_name}.`}</h4>
              </div>
            ) : (
              <ErrorBoundaryChart>
                {/* Catch the random timing error here, but don't abort. Continue on (with possible bad chart?!) */}
                {/* The two errors I've seen have been: 1. undefined is not an object (evaluating 'e.axes') */}
                {/* and 2. undefined is not an object (evaluating 'e.mouseCoord'). */}
                {/* Both have come from deep within CandleStickChartWithMA, but I've not found any relavent instructions there. */}
                <CandleStickChartWithMA chartId={chartId} data={this.data} symbol={chart_name} />
              </ErrorBoundaryChart>
            )}
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
