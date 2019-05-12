// Chartcell/index.js

// Each Chartcell gets its chart price data from the IEX API.
// Data is provided for free by IEX. View IEX’s Terms of Use.
// See: https://iextrading.com/developer/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
import { addEnterPrice, addExitPrice } from '../../../redux/thunkEditListObjects'
import buildSmaTradingArray from '../../../lib/appBuildSmaTradingArray'
import { getSymbolData } from '../../../lib/appGetSymbolData'
import { cleanSymbolData } from '../../../lib/appCleanSymbolData'
// import getChartLastBar from '../../../lib/apiGetChartLastBar'
import CandleStickChartWithMA from '../CandleStickChartWithMA'
import CandleStickChartWithMACD from '../CandleStickChartWithMACD'
import ChartDashboard from '../ChartDashboard'
import DialogChartCellForm from './DialogChartCellForm'
import { putDailyPriceData, getDailyPriceData, putWeeklyPriceData, getWeeklyPriceData } from '../../../lib/chartDataCache'
import buildSma200Array from '../../../lib/appBuildSma200Array'
import buildSma40Array from '../../../lib/appBuildSma40Array'
import buildLast20Closes from '../../../lib/appBuildLast20Closes'
// import { putSma40Data, putLast20Closes } from '../../../lib/chartDataCache'
// import { initSma, addSmaPrice, getSmaArray } from '../../../lib/appMovingAverage'
import { editListObjectPrarmeters } from '../../../redux/thunkEditListObjects'
import { AuthenticatedContext } from '../../../redux'
import './styles.css'

class Chartcell extends Component {
  static contextType = AuthenticatedContext
  constructor(props) {
    super(props)
    this.handleOrderEntry = this.handleOrderEntry.bind(this)
    this.handleOrderDispatch = this.handleOrderDispatch.bind(this)
    this.handleDispatchOfDialogEdit = this.handleDispatchOfDialogEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleDeleteDispatch = this.handleDeleteDispatch.bind(this)
    this.loadChartData = this.loadChartData.bind(this)
    // this.getLastBar = this.getLastBar.bind(this)
    this.dialogChartParams = null
    this.closeOnly = false // New for IEX Cloud data

    // ****************************************************
    // this.useSandbox = process.env.NODE_ENV === 'development' ? true : false // New for IEX Cloud data
    this.useSandbox = false // Set to false to test the stateMachine logic
    // ****************************************************
    this.range = '2y' // New for IEX Cloud data - changed below in loadChartData()    
    // this.values = null //array of price values from API call
    // this.filteredValues = null //array of price values remaining after filter
    this.data = null
    this.dispatch = this.props.dispatch
    this.state = {
      iexData: 0, // switch to trigger dashboard render when chart data is available
      hide: false,
      noprices: false,
    }
  }

  handleDispatchOfDialogEdit(parameterData) {
    // This is a callback function passed to the DialogChartCellForm component.
    // Because of a problem with the react stockchart component, the DialogChartCellForm
    // was created to separate its DOM with the <dialog> element, from this DOM.
    // The document.body.appendChild() procedure caused the D3 operations
    // in the charting code to fail when the append was done from this DOM.
    this.props.dispatch(editListObjectPrarmeters(this.hash, parameterData)) // renders updated chart
  }

  componentDidMount() {
    // Skip using recovered data from chartDataCache
    // Preloaded price data files from IEX are cached
    // in local storage to persist for the day,
    // and are found in getSymbolData()
    this.loadChartData()

    // let recoveredData
    // if (this.weeklyBars) {
    //   recoveredData = getWeeklyPriceData(this.symbol)
    // } else {
    //   recoveredData = getDailyPriceData(this.symbol)
    // }
    // if (recoveredData) {
    //   // another http request for chart data not needed
    //   this.data = recoveredData
    //   // but we need to rebuild the weekly sma40 data
    //   buildSma40Array(this.symbol, getWeeklyPriceData(this.symbol))
    //   // and we need to rebuild the Last 20 closes
    //   buildLast20Closes(this.symbol, getDailyPriceData(this.symbol))
    //   this.setState({ iexData: 2, hide: false }) //new data is available in cache
    // } else {
    //   // required data is not yet cached
    //   // this includes the weekly sma40 & last 20 closes
    //   this.loadChartData(this.weeklyBars)
    // }

  }

  componentDidUpdate(prevProps, prevState) {
    // Note that AcesTrader does not modify the value of this.closeOnly
    // (or this.useSandbox in production),
    // those parameters are for the AcesTester app. 
    // Only the weeklyBars option is changed here.
    if (prevProps.cellObject.weeklyBars !== this.props.cellObject.weeklyBars) {
      // console.log('componentDidUpdate with changed weeklyBars=' + this.props.cellObject.weeklyBars) // testing
      this.loadChartData() // produce daily or weekly bars depending on the boolean value of weeklyBars
    }
  }

  // dailyBars considered true if weeklyBars===false
  loadChartData = () => {
    const symbol = this.props.cellObject.symbol
    const weeklyBars = this.props.cellObject.weeklyBars
    this.range = weeklyBars ? '2y' : '1y' // New for IEX Cloud data
    const self = this
    // console.log(`getSymbolData ${symbol}, range=${this.range}, closeOnly=${this.closeOnly}, useSandbox=${this.useSandbox}`)
    getSymbolData(symbol, this.range, this.closeOnly, this.useSandbox)
      .then(function (data) {
        //console.log('getSymbolData axios response: data.length=', data.length)
        if (data.length < 2) {
          //CandleStickChartWithMA bug seen with new issue "TRTY" when only 0 or 1 day's data available
          //Memory leak reported by VSCode, seems to cause many weird code mistakes when running
          debugger // pause for developer
          self.setState({ iexData: 3, noprices: true, hide: false })
        } else {

          data = cleanSymbolData(data) // handle case of price data with OHLC zero values (i.e. CCOR)
          putDailyPriceData(symbol, data) //cache the daily price data for retrieval before rendering

          // Create the crossover trading sma for this symbol and cache it
          const smaPeriod = self.props.cellObject.dashboard.tradeSma
          buildSmaTradingArray(symbol, data, smaPeriod)

          // Get the last 20 close prices and dates from the daily data
          // for subsequent use in trailingStopBasis adjustments
          // if you missed running the app for a few days
          buildLast20Closes(symbol, data)

          // Cache the sma200 values from the daily prices
          // for subsequent use in trading alerts
          buildSma200Array(symbol, data) // this includes saving the result (by symbol) in chartDataCache

          let weeklyPriceData = self.convertToWeeklyBars(data)
          putWeeklyPriceData(symbol, weeklyPriceData) //cache the weekly price data for retrieval before rendering
          // Cache the sma40 values from the weekly prices
          // for subsequent use in trend trading alerts
          buildSma40Array(symbol, weeklyPriceData)

          self.setState({ iexData: 1, noprices: false, hide: false }) //triggers render using the cached data
        }
      })
      .catch(function (error) {
        console.log('getSymbolData axios error:', error.message)
        // self.setState({ iexData: 4, noprices: true, hide: false })
        alert('getSymbolData axios error: ' + error.message) //rude interruption to user
        debugger // pause for developer
      })
  }
  convertToWeeklyBars = (data) => {
    // data is daily price series
    let obj, day, lastDate
    let open, high, low, close, volume
    let lastDay = 2 // initialize to Tuesday to start with 1st Monday
    let weeklyBars = []
    for (let k = 0; k < data.length; k++) {
      obj = data[k].date
      day = obj.getDay() // gets the day of the week (from 0-6)
      if (day < lastDay) {
        // day's index number is smaller than the prior day, so start of new week
        // close current weekly bar if any started
        if (open) {
          // saved data is present, this avoids a false weekly close
          // if the first day of this file is a Monday
          weeklyBars.push({ date: lastDate, open: open, high: high, low: low, close: close, volume: volume })
        }
        // initialize the first price data for the next weekly bar
        open = data[k].open
        high = data[k].high
        low = data[k].low
        close = data[k].close
        volume = data[k].volume
      } else if (open) {
        // update the price data for the current weekly bar
        high = high > data[k].high ? high : data[k].high
        low = low < data[k].low ? low : data[k].low
        close = data[k].close
        volume += data[k].volume
      }
      if (k === data.length - 1) {
        // Tests for end of file to close weekly bar now
        // This is the last daily bar, so close current weekly bar
        lastDate = data[k].date
        weeklyBars.push({ date: lastDate, open: open, high: high, low: low, close: close, volume: volume })
      }
      lastDay = day // save this day's week index number
      lastDate = data[k].date
    }
    return weeklyBars //this is for a weekly bar chart of prices
  }


  /**
   * The getLastBar button is a possible future feature which composes a last bar from the last peek data
   */
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
  //         // self.setState({ iexData: 5, hide: false }) //triggers render using the cached data
  //       }
  //     })
  //     .catch(function(error) {
  //       console.log('axios error:', error.message)
  //       alert('axios error: ' + error.message) //rude interruption to user
  //       debugger // pause for developer
  //     })
  // }

  handleOrderEntry() {
    // fade-out this object before dispatching redux action,
    // which will remove this object and then
    // will snap in new object and reset all props.
    this.setState({ hide: true })
    setTimeout(this.handleOrderDispatch, 200)
  }

  handleOrderDispatch() {
    // This is a newly opened position or a newly closed position for this symbol
    this.setState({ hide: false })
    //TODO Use a Button to fetch confirmed trade data (when available) for the specified hash id object.
    //TODO Get the filled price, quantity, and account number from Ameritrade********
    const enteredPrice = 'pending'
    const exitedPrice = 'pending'
    const theAccount = 'pending'
    const theCellObject = this.props.cellObject //the target object originating the dispatch action
    //use 'pending' until brokerage api interface is enabled, Guest will see the programmed calculated quantity
    const filledQuantity = this.context.email === 'a@g.com' ? 'pending' : this.props.cellObject.dashboard.quantity
    const enteredQuantityType = this.props.cellObject.dashboard.quantityType
    const theHash = this.props.cellObject.hash //from target object before its removal by dispatch below

    switch (this.tradeSide.toUpperCase()) {
      case 'BUYS': {
        this.props.dispatch(addLongToList(theCellObject, enteredPrice, filledQuantity, enteredQuantityType, theAccount))
        this.props.dispatch(removeBuyFromList(this.symbol, this.hash))
        if (false) {
          this.props.dispatch(addEnterPrice(theHash)) //leave as 'pending' until brokerage api interface is enabled
        }
        break
      }
      case 'SHORT SALES': {
        this.props.dispatch(addShortToList(theCellObject, enteredPrice, filledQuantity, enteredQuantityType, theAccount))
        this.props.dispatch(removeSellFromList(this.symbol, this.hash))
        if (false) {
          this.props.dispatch(addEnterPrice(theHash)) //leave as 'pending' until brokerage api interface is enabled
        }
        break
      }
      case 'TREND BUYS': {
        this.props.dispatch(addTrendLongToList(theCellObject, enteredPrice, filledQuantity, enteredQuantityType, theAccount))
        this.props.dispatch(removeTrendBuyFromList(this.symbol, this.hash))
        if (false) {
          this.props.dispatch(addEnterPrice(theHash)) //leave as 'pending' until brokerage api interface is enabled
        }
        break
      }
      case 'LONGS': {
        this.props.dispatch(addResultToList(theCellObject, exitedPrice))
        this.props.dispatch(removeLongFromList(this.symbol, this.hash))
        if (false) {
          this.props.dispatch(addExitPrice(theHash)) //leave as 'pending' until brokerage api interface is enabled
        }
        break
      }
      case 'SHORTS': {
        this.props.dispatch(addResultToList(theCellObject, exitedPrice))
        this.props.dispatch(removeShortFromList(this.symbol, this.hash))
        if (false) {
          this.props.dispatch(addExitPrice(theHash)) //leave as 'pending' until brokerage api interface is enabled
        }
        break
      }
      case 'TREND LONGS': {
        this.props.dispatch(addResultToList(theCellObject, exitedPrice))
        this.props.dispatch(removeTrendLongFromList(this.symbol, this.hash))
        if (false) {
          this.props.dispatch(addExitPrice(theHash)) //leave as 'pending' until brokerage api interface is enabled
        }
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
    if (this.tradeSide.toUpperCase() === 'BUYS') {
      this.props.dispatch(removeBuyFromList(this.symbol, this.hash))
    } else if (this.tradeSide.toUpperCase() === 'SHORT SALES') {
      this.props.dispatch(removeSellFromList(this.symbol, this.hash))
    } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
      this.props.dispatch(removeTrendBuyFromList(this.symbol, this.hash))
    } else if (this.tradeSide.toUpperCase() === 'LONGS') {
      this.props.dispatch(removeLongFromList(this.symbol, this.hash))
    } else if (this.tradeSide.toUpperCase() === 'SHORTS') {
      this.props.dispatch(removeShortFromList(this.symbol, this.hash))
    } else if (this.tradeSide.toUpperCase() === 'TREND LONGS') {
      this.props.dispatch(removeTrendLongFromList(this.symbol, this.hash))
    } else {
      alert('ERROR3 Missing tradeSide in Chartcell')
      // debugger // pause for developer
    }
  }

  render() {
    const cellObject = this.props.cellObject
    this.weeklyBars = cellObject.weeklyBars
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

    // A re-render will happen without life cycle calls when a list item is deleted,
    // so we make sure we have the correct data for the new current symbol
    this.data = this.weeklyBars ? getWeeklyPriceData(this.symbol) : getDailyPriceData(this.symbol)

    return (
      <div id={'chart-main' + this.hash}>
        <div id={wrapperId} className={`chart-cell-wrapper  ${this.state.hide ? 'fadeout' : ''}`}>
          {/* the Chartcell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
          <div id={cell_id} className='chart-cell'>
            <DialogChartCellForm cellObject={this.props.cellObject} handleDispatchOfDialogEdit={this.handleDispatchOfDialogEdit} />
            <div className='form-header'>
              <button onClick={this.handleDelete} className='cell-delete-button' type='button' aria-label='delete'>
                &times;
              </button>
            </div>
            <div id={chartId} className='graph-content'>
              {this.state.noprices ? (
                <div id={cell_id} className='chart-cell-alert-wrapper'>
                  {' '}
                  <h4>{`No Prices Available For ${chart_name}.`}</h4>
                </div>
              ) : this.state.iexData === 0 ? (
                <div id={cell_id} className='chart-cell-alert-wrapper'>
                  <h4>{`Loading Chart ${chart_name}. Please Wait...`}</h4>
                </div>
              ) : (
                    <ErrorBoundary chart={true}>
                      {/* Catch the random D3 errors here, but don't abort. Continue on (with possible bad chart?!) */}
                      {/* Note: this problem has apparently been fixed by changing the stockchart's defaultProps */}
                      {/* to type:'svg' from type:'hybrid'. I think the errors came from operations on the html canvas. */}
                      {this.props.cellObject.macdChart ? (
                        <CandleStickChartWithMACD
                          chartId={chartId}
                          data={this.data}
                          symbol={chart_name}
                          weekly={this.props.cellObject.weeklyBars ? true : false}
                          errorCount={this.props.errorCount}
                        />
                      ) : (
                          <CandleStickChartWithMA
                            chartId={chartId}
                            data={this.data}
                            symbol={chart_name}
                            weekly={this.props.cellObject.weeklyBars ? true : false}
                            errorCount={this.props.errorCount}
                          />
                        )}
                    </ErrorBoundary>
                  )}
            </div>
            <div className='dashboard-center'>
              <ChartDashboard handleOrderEntry={this.handleOrderEntry} cellObject={cellObject} iexData={this.state.iexData} />
            </div>
          </div>
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
