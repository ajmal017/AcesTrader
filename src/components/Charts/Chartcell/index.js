// Chartcell/index.js

// Each Chartcell gets its chart price data from the IEX API
// and creates the chart display data
// Data provided for free by IEX. View IEX’s Terms of Use.
// See: https://iextrading.com/developer/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import dialogPolyfill from 'dialog-polyfill'
import ErrorBoundary from '../../../components/ErrorBoundary/'
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
import CandleStickChartWithMACD from '../CandleStickChartWithMACD'
import ChartDashboard from '../ChartDashboard'
import { putPriceData, getPriceData } from '../../../lib/chartDataCache'
import { editListObjectPrarmetersAsync } from '../../../redux/thunkEditListObjects'
import './styles.css'
var cloneDeep = require('lodash.clonedeep')

class Chartcell extends Component {
  constructor(props) {
    super(props)
    this.handleEditChartParams = this.handleEditChartParams.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleEntry = this.handleEntry.bind(this)
    this.handleOrderDispatch = this.handleOrderDispatch.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleDeleteDispatch = this.handleDeleteDispatch.bind(this)
    this.loadChartData = this.loadChartData.bind(this)
    // this.getLastBar = this.getLastBar.bind(this)
    this.dialogChartParams = null
    this.values = null //array of price values from API call
    this.filteredValues = null //array of price values remaining after filter
    this.data = null
    this.state = {
      data: false,
      hide: false,
      noprices: false,
    }
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({
      [name]: value,
    })
  }

  handleRadioChange(event) {
    const value = event.target.value
    if (value === 'daily') this.setState({ weeklyBars: false })
    if (value === 'weekly') this.setState({ weeklyBars: true })
    if (value === 'ma') this.setState({ macdChart: false })
    if (value === 'macd') this.setState({ macdChart: true })
  }

  handleEditChartParams(event) {
    // Reset the state of dialog's values, using the current props, to replace left-over values from a canceled updated
    let weeklyBars = this.props.cellObject.weeklyBars ? true : false
    let macdChart = this.props.cellObject.macdChart ? true : false
    this.setState({ weeklyBars: weeklyBars, macdChart: macdChart })
    // let prevState = this.state
    // console.log(`Model Entrance weeklyBars=${weeklyBars} macdChart=${macdChart}`)
    // console.log(JSON.stringify(prevState, null, 2)) // a readable log of the object's json
    // Right click > Copies All in the Console panel to copy to clipboard
    this.dialogChartParams.showModal()
    let self = this //Note: bind(this) does not seem to work here. Polyfill problem?
    this.dialogChartParams.addEventListener('close', function(event) {
      if (self.dialogChartParams.returnValue === 'yes') {
        // Save the parameterData which is an object with key/value pairs for each form field: {name: value, name: value, ...}
        let parameterData = { weeklyBars: self.state.weeklyBars, macdChart: self.state.macdChart }
        self.props.dispatch(editListObjectPrarmetersAsync(self.hash, parameterData))
        // Note: this dispatch changes the store's state which re-renders this component delivering new props
      }
    })
  }

  componentDidMount() {
    // first try to recover cached price data to avoid another http request
    this.data = cloneDeep(getPriceData(this.props.cellObject.symbol))
    if (this.data) {
      this.setState({ data: true, hide: false }) //data is available in cache
    } else {
      this.loadChartData(this.props.cellObject.weeklyBars)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data === false && this.state.data === true) {
      this.dialogChartParams = document.getElementById('chart-params' + this.hash)
      dialogPolyfill.registerDialog(this.dialogChartParams) // Now dialog acts like a native <dialog>.
    }
  }

  // dailyBars if weeklyBars===false
  loadChartData = (weeklyBars = false) => {
    const symbol = this.props.cellObject.symbol
    const range = weeklyBars ? '5yr' : '1y'
    const self = this
    // console.log('loadChartData ' + symbol)
    getChartData(symbol, range)
      .then(function(data) {
        if (data.length < 2) {
          //CandleStickChartWithMA bug seen with new issue "TRTY" when only 0 or 1 day's data available
          //Memory leak reported by VSCode, seems to cause many weird code mistakes when running
          self.setState({ data: true, noprices: true, hide: false })
        } else {
          let priceData = weeklyBars ? this.convertToWeeklyBars(data) : data
          putPriceData(symbol, priceData) //cache the price data for subsequent rendering
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
  convertToWeeklyBars = (data) => {
    return data // temporary
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
    // Use a Button to fetch confirmed trade data (when available) for the specified hash id object.
    // Get the filled price, quantity, and account number from Ameritrade********
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
    this.data = getPriceData(this.props.cellObject.symbol)

    // const test = this.props.cellObject.macdChart
    // const test2 = this.props.cellObject.macd

    return (
      <>
        <dialog id={'chart-params' + this.hash} className={'chart-edit-form'}>
          <span className={'dialog-symbol'}> {this.symbol} - Make Your Changes Below.</span>
          <br />
          <br />
          <form method="dialog">
            <div className="chart-radio-block">
              <div className="chart-radio-row">
                <input type="radio" value="daily" name="seriesBars" onChange={this.handleRadioChange} checked={this.state.weeklyBars !== true} />
                Daily Bars
                <span>&nbsp;&nbsp;&nbsp;</span>
                <input type="radio" value="weekly" name="seriesBars" onChange={this.handleRadioChange} checked={this.state.weeklyBars === true} />
                Weekly Bars
              </div>
            </div>
            <div className="chart-radio-block">
              <div className="chart-radio-row">
                <input type="radio" value="ma" name="indicators" onChange={this.handleRadioChange} checked={this.state.macdChart !== true} />
                With MA
                <span>&nbsp;&nbsp;&nbsp;</span>
                <input type="radio" value="macd" name="indicators" onChange={this.handleRadioChange} checked={this.state.macdChart === true} />
                With MACD
              </div>
            </div>
            <br />
            <br />
            <button type="submit" value="no">
              Cancel
            </button>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <button type="submit" value="yes">
              Save
            </button>
          </form>
        </dialog>
        <div id={wrapperId} className={`chart-cell-wrapper ${this.state.hide ? 'fadeout' : ''}`}>
          {/* the Chartcell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
          <div id={cell_id} className="chart-cell">
            <div className="graph-header">
              <span className="cell-title">{chart_name}</span>
              <span className="chart-series-label">{this.props.cellObject.weeklyBars ? 'Weekly Bars' : 'Daily Bars'}</span>
              <span className="chart-indicator-label">{this.props.cellObject.macdChart ? 'With MACD' : 'With MA'}</span>
              {/* <button onClick={this.getLastBar} className="cell-getlast-button" type="button" aria-label="getlast">
              Get Last
            </button> */}
              <button onClick={this.handleEditChartParams} className={'chart-edit-button'}>
                <img
                  alt=""
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVDhP1ZDBCYQwFAWzF2FtQbAMYT1pZXraKjzK3rcBrcI+7EDnRXMR1hgPKw4M8oT38xPzbzJ8Y2RTICmOOOEXg4Yk67dGDZDa5BAv1MmVTcsQZV3Hiyu7U90Qt9Eu27JU1lt4+VXWfy85XlMWT/zgqXKBD9QjtaiyNjpMjw1qSIxBZTFgh6VNN8GYGaGaLE+Bi37NAAAAAElFTkSuQmCC"
                />
              </button>
            </div>
            <div className="form-header">
              {/* if this.entered is undefined, this is still in a Prospects list, so the X delete button is added */}
              {this.entered === undefined ? (
                <button onClick={this.handleDelete} className="cell-delete-button" type="button" aria-label="delete">
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
                <ErrorBoundary sentry={true} chart={true}>
                  {/* Catch the random timing error here, but don't abort. Continue on (with possible bad chart?!) */}
                  {this.props.cellObject.macdChart ? (
                    <CandleStickChartWithMACD chartId={chartId} data={this.data} symbol={chart_name} errorCount={this.props.errorCount} />
                  ) : (
                    <CandleStickChartWithMA chartId={chartId} data={this.data} symbol={chart_name} errorCount={this.props.errorCount} />
                  )}
                </ErrorBoundary>
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
      </>
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
