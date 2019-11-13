// ChartDashboard/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DialogDashboardForm from './DialogDashboardForm'
import { stateMachine } from '../../../lib/appStateMachine'
import { getLastSmaTradingPrice } from '../../../lib/chartDataCache'
import { getLastSma40Price } from '../../../lib/chartDataCache'
import { editListObjectPrarmeters } from '../../../redux/thunkEditListObjects'
import { getLast20Closes } from '../../../lib/chartDataCache'
import { getHighestLowestCloses } from '../../../lib/appGetHighestLowestCloses'
import { getDailyPriceDataLastBar } from '../../../lib/chartDataCache'
import { getSymbolCompanyData } from '../../../lib/appGetSymbolCompanyData'
// import { getChartFlags } from '../../../lib/chartDataCache'
import { AuthenticatedContext } from '../../../redux'
import { getDaysDiff } from '../../../lib/appGetDaysDiff'
import './styles.css'
import './stylesTextWidths.css'

/*** Create the Peek price data to be shown in the chart dashboard */
function PeekStatusLine({ hash, listGroup, peekDate, peekPrice, dollarGain, percentGain, daysHere, positionValue, rgbaValue }) {
  // let thePositionValue = listGroup === 'positions' ? `, Value: ${positionValue}` : null
  let nd = new Date(peekDate)
  // const displayDate = `${1 + nd.getMonth()}/${nd.getDate()} ${nd.getHours()}:${nd.getMinutes()}`
  const displayDate = `${1 + nd.getMonth()}/${nd.getDate()} ${nd
    .toLocaleTimeString()
    .toLowerCase()
    .replace(/:\d\d\s/, '')}`
  const displayGain = percentGain > 0 ? `+${percentGain}` : `${percentGain}`
  const backgroundColor = rgbaValue ? 'rgba(' + rgbaValue + ')' : 'transparent'
  return peekDate !== undefined ? (
    <div style={{ backgroundColor: backgroundColor }}>
      <span id={'positions' + hash} className='watched'>
        Peek {displayDate} &nbsp;@{peekPrice}
        &nbsp;&nbsp;{displayGain}% &nbsp;&nbsp;{daysHere} days
        {/* {thePositionValue} */}
      </span>
    </div>
  ) : null
}

class ChartDashboard extends Component {
  static contextType = AuthenticatedContext
  constructor(props) {
    super(props)
    this.handleOrderEntry = this.handleOrderEntry.bind(this)
    this.handleEditDialogOpen = this.handleEditDialogOpen.bind(this)
    this.handleEditDialogClose = this.handleEditDialogClose.bind(this)
    this.state = {
      showDialog: false,
      showConfirm: false,
      showCompanyData: false,
      companyData: '',
    }
  }

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  /*** Get the security's description to be shown in the chart dashboard */
  async getCompanyData(symbol) {
    try {
      const data = await getSymbolCompanyData([symbol])
      let content = data.arr[0].data.description
      if (content === '') {
        if (data.arr[0].data.issueType === 'et') {
          content = 'This security is an ETF, there is no company description.' // in the ${data.arr[0].data.sector} sector`
        } else {
          content = "This security's description was not found."
        }
      }
      return content
    } catch (err) {
      return `${symbol} company description not found. Error ${err.message}`
    }
  }

  handleEditDialogOpen(event) {
    event.preventDefault()
    // note that EditDialog is the default target to show when the others are false
    this.setState({
      showDialog: true,
      showConfirm: false,
      showCompanyData: false,
      companyData: '',
    })
  }
  doConfirmDialogOpen() {
    this.setState({
      showDialog: true,
      showConfirm: true,
      showCompanyData: false,
      companyData: '',
    })
  }
  async doCompanyDataDialogOpen() {
    const companyData = await this.getCompanyData(this.props.cellObject.symbol)
    this.setState({
      showDialog: true,
      showConfirm: false,
      showCompanyData: true,
      companyData: companyData,
    })
  }

  handleEditDialogClose(returnValue) {
    if (returnValue) {
      // the returnValue is null if dialog was cancelled, else
      // the returnValue is object of shape {action:string, formFields:{}}

      if (returnValue.action === 'edit') {
        // the returnValue has an object with key/value pairs for each form field: {name: value, name: value, ...}
        this.props.dispatch(editListObjectPrarmeters(this.hash, returnValue.formFields))
      } else if (returnValue.action === 'confirm') {
        this.props.handleOrderEntry() // the order entry was confirmed, call into parent
      } else {
        alert('Missing returnValue.action in handleEditDialogClose')
        debugger // pause for developer
      }
    }
    this.setState({
      showDialog: false,
    })
  }

  handleOrderEntry = (event) => {
    event.preventDefault()
    this.doConfirmDialogOpen() // Call for a confirmation dialog
  }

  handleCompanyDataRequest = (event) => {
    event.preventDefault()
    this.doCompanyDataDialogOpen() // Call for a CompanyData dialog
  }

  render() {
    //handle new props with changed state of cellObjects
    this.symbol = this.props.cellObject.symbol
    this.validShortSma = this.props.validShortSma // special tag identify symbol listing with short array of daily prices (>50)
    this.validLongSma = this.props.validLongSma // special tag identify symbol listing with long array of daily prices (>200)
    this.weekly = this.props.cellObject.weeklyBars
    this.hash = this.props.cellObject.hash
    this.listGroup = this.props.cellObject.listGroup
    this.companyName = this.props.cellObject.companyName
    this.trailingStopBasis = this.props.cellObject.trailingStopBasis
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
    this.buttonLabel = this.props.cellObject.dashboard.buttonLabel
    this.trailingStopPercent = this.props.cellObject.trailingStopPercent || 5 //<**** Sets a default trailing stop percentage

    this.instructionRaw = this.props.cellObject.dashboard.instruction
    this.instructionTest = this.tradeSide === 'Shorts' ? true : false
    this.instruction = this.instructionTest ? 'COVER' : this.instructionRaw
    this.stoplossAlert = false // until triggered by calculations below
    this.stoplossBackgroundColor = 'transparent'

    const defaultRgbaBackground = '206,212,218,0.3'
    const alertRgbaBackground = '255, 219, 77,0.6'
    const startPrice = this.listGroup === 'positions' ? this.enteredPrice : this.watchedPrice
    this.dollarGain = this.peekDate !== undefined ? (this.peekPrice - startPrice).toFixed(2) : 'pending'
    this.percentGain = this.peekDate !== undefined ? ((100 * (this.peekPrice - startPrice)) / startPrice).toFixed(1) : 'pending'
    this.positionValue = this.peekDate !== undefined ? this.numberWithCommas((this.filledQuantity * this.peekPrice).toFixed(0)) : 'pending'
    this.rgbColor = null
    this.rgbColor = this.percentGain > 0 ? '0,255,0' : '255,107,107'
    this.rgbOpacity = Math.min(Math.abs(this.percentGain / 100) * 20, 0.28)
    if (this.listGroup === 'positions') {
      this.rgbaValue = this.rgbColor + ',' + this.rgbOpacity
    } else {
      this.rgbaValue = null // do not show red/green background color for prospects
    }
    const startDate = this.listGroup === 'positions' ? new Date(this.entered) : new Date(this.watched)
    this.daysHere = getDaysDiff(this.peekDate, startDate)
    this.tradeSideLc = this.tradeSide.toLowerCase().replace(/[\W_]/g, '')
    if (this.listGroup === 'positions') {
      // The calculated trailing stop price is  shown in the dashboard
      this.trailingStopPrice = null
      if (this.tradeSide === 'Shorts') {
        this.trailingStopPrice = (this.trailingStopBasis + (this.trailingStopPercent * this.trailingStopBasis) / 100).toFixed(2)
      } else {
        this.trailingStopPrice = (this.trailingStopBasis - (this.trailingStopPercent * this.trailingStopBasis) / 100).toFixed(2)
      }
    }

    /**Translate the state code returned from the statemachine to readable terms for display in the dashboard */
    const stateXlate = {
      'Long>SMA': 'LONG', // Long>SMA and Long<SMA
      'Long<SMA': 'LONG', // Long>SMA and Long<SMA
      'Cash>SMA': 'CASH', // Cash>SMA and Cash<SMA
      'Cash<SMA': 'CASH', // Cash>SMA and Cash<SMA
      LongAboveLater: 'PENDING', //'Buy above ma will be active at interval end',
      LongAboveNow: 'BUY', //'Buy above ma now, skipping interval period',
      LongAboveRevert: 'BUY', //'Buy above ma now, reverting panic sell',
      CashBelowLater: 'PENDING', //'Sell below ma will be active at interval end',
      CashBelowNow: 'SELL', //'Sell below ma now, skipping interval period',
      CashBelowRevert: 'SELL', //'Sell below ma now, reverting urgent buy',
      LongBelowNow: 'BUY', //'Urgent Buy below ma cross',
      CashAboveNow: 'SELL', //'Urgent Sell above ma cross',
      // Obsolete returned codes below
      'Buy above ma at interval end': 'PENDING',
      'Buy above ma now, skipping interval period': 'BUY',
      'Buy above ma now, reverting panic sell': 'BUY',
      'Sell below ma at interval end': 'PENDING',
      'Sell below ma now, skipping interval period': 'SELL',
      'Sell below ma now, reverting urgent buy': 'SELL',
      'Urgent Buy below ma cross': 'BUY',
      'Urgent Sell above ma cross': 'SELL',
    }

    // **TAKE NOTE of the value of this.props.iexData which controls processing past this point**

    if (this.props.iexData === 0) {
      this.rgbaBackground = defaultRgbaBackground // chart data not available yet, not able to test for any alert now
    } else {
      // When iexData > 0, it means chart data is available in Chartcell,
      // providing new props for ChartDashboard to calculate alerts and sma displays

      // const chartFlags = getChartFlags(this.symbol) //  { validShortSma: x, validLongSma: y, weeklyBarCount: z }

      this.lastTradeSma = this.validShortSma ? getLastSmaTradingPrice(this.symbol).toFixed(2) : ' '
      this.tradeSma = this.props.cellObject.dashboard.tradeSma

      this.lastBar = getDailyPriceDataLastBar(this.symbol)
      if (this.peekDate === undefined) {
        this.lastPrice = this.lastBar.close
      } else {
        const peekDate = new Date(this.peekDate)
        const barDate = new Date(this.lastBar.date)
        if (peekDate < barDate) {
          //peekDate is stale
          this.lastPrice = this.lastBar.close
        } else {
          this.lastPrice = this.peekPrice
        }
      }

      if (!this.validShortSma || (this.weekly && !this.validLongSma)) {
        // This is a chart with a too short array of prices to build a SMA,
        // so a trading strategy signal will not be produced.
        // But trailing sell stops can still be calculated and shown.
        this.currentState = 'ChartOnly'
        this.daysInterval = ' '
        this.lastTradeSma = ' '
        this.tradeSma = ' '
        // this.trailingStopPercent = ' '
        // this.trailingStopPrice = ' '
      } else {
        // Set these defaults
        this.daysInterval = 4 // override the this.props.cellObject.dashboard.daysInterval //equivalent to bars interval for weekly charts
        this.currentState = this.props.cellObject.dashboard.currentState

        if (this.weekly && this.validLongSma) {
          // Calculate action signal for TrendLong positions using weekly bar charts
          this.testState = {
            // Prepare the parameters for use by stateMachine()
            SMA: 'W', // use fixed weekly bars interval
            SMA3: this.daysInterval, // the weekly bars interval count
            ET1: false, // do not enable crossover sell
            TS1: 4, //crossover sell stop %
            ET4: false, // do not enable crossover buy
            TS4: 4, //crossover buy stop %
            CLOSEONLY: false, // OHLC is available to be used
            USESANDBOX: this.props.useSandbox, // the input series OHLC values are randomly distorted if this is true
          }

          // Determine the status of the long term SMA40 buy/sell alert signals
          this.lastSma40 = getLastSma40Price(this.symbol)
          if (this.lastSma40) {
            // Flag any trend following alerts
            if (this.tradeSide !== 'Shorts') {
              if (this.listGroup === 'prospects') {
                this.rgbaBackground = this.peekPrice > this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trending buy OR default background
              }
              if (this.listGroup === 'positions') {
                this.rgbaBackground = this.peekPrice < this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trending sell OR default background
              }
            } else if (this.tradeSide === 'Shorts') {
              if (this.listGroup === 'prospects') {
                this.rgbaBackground = this.peekPrice < this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trending buy OR default background
              }
              if (this.listGroup === 'positions') {
                this.rgbaBackground = this.peekPrice > this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trending sell OR default background
              }
            }
          }
        } else if (this.validShortSma) {
          // Calculate action signal for Long positions using daily bar charts
          this.testState = {
            // Prepare the parameters for use by stateMachine()
            SMA: 'D', // use fixed day bars interval
            SMA3: this.daysInterval, // the daily bars interval count
            ET1: false, // do not enable crossover sell
            TS1: 4, //crossover sell stop %
            ET4: false, // do not enable crossover buy
            TS4: 4, //crossover buy stop %
            CLOSEONLY: false, // OHLC is available to be used
            USESANDBOX: false, // the input series OHLC values are randomly distorted if this is true
            // USESANDBOX: this.props.useSandbox, // the input series OHLC values are randomly distorted if this is true
          }
        }

        // Use the stateMachine to get the last state
        const { currentState } = stateMachine(this.testState, this.symbol)
        this.currentState = stateXlate[currentState] //get appropriate text for dashboard display

        if (this.currentState === 'PENDING' && this.lastPrice > getLastSmaTradingPrice(this.symbol) && this.listGroup === 'positions') {
          this.currentState = 'LONG' // correct for trade done ahead of fixed-days interval and unknown to the stateEngine logic
        }
        //BCM EFA testing- comment out 7/31/2019, activated 8/5/2019 VEU VT VTV VWO
        if (this.currentState === 'PENDING' && this.lastPrice < getLastSmaTradingPrice(this.symbol) && this.listGroup === 'prospects') {
          this.currentState = 'CASH' // correct for trade done ahead of fixed-days interval and unknown to the stateEngine logic
        }

        // console.log(`currentState=${currentState}`) // testing
        this.rgbaBackground = defaultRgbaBackground // only weekly bars charts get trend alerts

        if (this.listGroup === 'positions') {
          // The trailing stop loss alert is only for positions.
          // Note that a trailing stop loss alert overrides any trend following SMA40 test result
          // Adjust the trailingStopBasis if the closing price is further to the gain side
          // Changing this.trailingStopBasis here now is for immediate effect
          // Permanent change will be done in reducePeekData.js the next time ChartView is rendered.
          const last20Closes = getLast20Closes(this.symbol)
          if (last20Closes && last20Closes.length > 0) {
            const highestLowestCloses = getHighestLowestCloses(last20Closes, this.entered) // returns {highest: price, lowest: price}
            if (this.tradeSide === 'Shorts' && this.trailingStopBasis > highestLowestCloses.lowest) {
              this.trailingStopBasis = highestLowestCloses.lowest
            } else if (this.tradeSide !== 'Shorts' && this.trailingStopBasis < highestLowestCloses.highest) {
              this.trailingStopBasis = highestLowestCloses.highest
            }
          }
          // Calculate any trailing stop loss alert
          this.stopGap = this.peekPrice - this.trailingStopBasis
          this.percentTrailingStopGap = (100 * this.stopGap) / this.trailingStopBasis //.toFixed(1)
          if (
            (this.tradeSide === 'Shorts' && this.percentTrailingStopGap > this.trailingStopPercent) ||
            (this.tradeSide !== 'Shorts' && this.percentTrailingStopGap < -this.trailingStopPercent)
          ) {
            this.stoplossAlert = true // show alert for trailing stop loss
            this.stoplossBackgroundColor = 'rgba(255,107,107,0.3)'
          }
          // this.stoplossAlert = true // ***TESTING THE ALERT FOR TRAILING STOP LOSS***
        }
      }
    }
    // console.log(` ${this.symbol} - trailingStopBasis: ${this.trailingStopBasis}`)

    const ActionButton = styled.button`
      font-size: 16px;
      background: rgba(${this.rgbaBackground}); //rgbaBackground is calculated above for trading alerts
      :hover {
        background: #c7c4dd;
        // background: #ced4da;
      }
    `

    this.dialogDashboardFormValues = {
      watched: this.watched,
      watchedPrice: this.watchedPrice,
      entered: this.entered,
      enteredPrice: this.enteredPrice,
      filledQuantity: this.filledQuantity,
      companyName: this.companyName,
      session: this.session,
      instruction: this.instruction,
      quantity: this.quantity,
      quantityType: this.quantityType,
      orderType: this.orderType,
      duration: this.duration,
      trailingStopPercent: this.trailingStopPercent,
      smaTrading: this.tradeSma,
      daysInterval: this.daysInterval,
    }

    return (
      <div className='dashboard'>
        <DialogDashboardForm
          showDialog={this.state.showDialog}
          showConfirm={this.state.showConfirm}
          showCompanyData={this.state.showCompanyData}
          companyData={this.state.companyData}
          hash={this.hash}
          symbol={this.symbol}
          formValues={this.dialogDashboardFormValues}
          listGroup={this.listGroup}
          tradeSideLc={this.tradeSideLc}
          trailingStopBasis={this.trailingStopBasis}
          exitCallback={this.handleEditDialogClose}
        />
        <div className='dashboard-data'>
          <form className='dashboard-form'>
            <div className='events-log'>
              <PeekStatusLine
                hash={this.hash}
                listGroup={this.listGroup}
                peekDate={this.peekDate}
                peekPrice={this.peekPrice}
                dollarGain={this.dollarGain}
                percentGain={this.percentGain}
                daysHere={this.daysHere}
                positionValue={this.positionValue}
                rgbaValue={this.rgbaValue}
              />

              <div>
                {this.listGroup === 'prospects' ? (
                  <span className='watched'>
                    Watched {this.watched} @{this.watchedPrice}
                  </span>
                ) : null}
                {this.listGroup === 'positions' ? (
                  <span className='entered'>
                    Entered {this.entered}
                    &nbsp; @{this.enteredPrice}
                  </span>
                ) : null}

                {this.filledQuantity !== undefined ? (
                  <span className='filledquantity'>
                    Quantity {this.filledQuantity}
                    {/* &nbsp;&nbsp; Account {this.account} */}
                  </span>
                ) : null}
              </div>

              <div>{this.lastSma40 ? <span className='weeklysma'>Weekly Sma(40): &nbsp;{this.lastSma40.close.toFixed(2)}</span> : null}</div>
            </div>

            <label htmlFor='daysInterval'>Fixed Days</label>
            <input className={'daysIntervalValue'} readOnly type='text' name='daysInterval' value={this.daysInterval} />
            <label htmlFor='currentState'>State</label>
            <input className={'currentStateText'} readOnly type='text' name='currentState' value={this.currentState} />
            <br />

            <label htmlFor='tradeSma'>Trading Sma</label>
            <input className={'tradeSmaPeriod'} readOnly type='text' name='tradeSma' value={this.tradeSma} />
            <label htmlFor='lastTradeSma'>Last T Sma</label>
            <input className={'lastTradeSmaPrice'} readOnly type='text' name='lastTradeSma' value={this.lastTradeSma} />
            <br />

            {/* The content below is removed until online access to broker trading API enabled. */}
            {this.context && this.context.email === 'xxxxxxx@g.com' ? (
              <>
                <label htmlFor='instruction'>Order</label>
                <input className={'instruction-' + this.tradeSideLc} readOnly type='text' name='instruction' value={this.instruction} />
                <label htmlFor='orderType'>OrderType</label>
                <input className={'ordertype-' + this.tradeSideLc} readOnly type='text' name='orderType' value={this.orderType} />
                <br />
                <label htmlFor='quantity'>Quantity</label>
                <input className={'quantity-' + this.tradeSideLc} readOnly type='text' name='quantity' value={this.quantity} />
                <label htmlFor='quantityType'>Type</label>
                <input className={'quantitytype-' + this.tradeSideLc} readOnly type='text' name='quantityType' value={this.quantityType} />
                <br />
                <label htmlFor='session'>Session</label>
                <input className={'session-' + this.tradeSideLc} readOnly type='text' name='session' value={this.session} />
                <label htmlFor='duration'>Duration</label>
                <input className={'duration-' + this.tradeSideLc} readOnly type='text' name='duration' value={this.duration} />
              </>
            ) : null}
            {/* The above content removed until online access to broker trading API enabled */}

            {this.listGroup === 'positions' ? (
              <>
                {/* {this.stoplossAlert ? <br /> : null} */}
                <div style={{ backgroundColor: this.stoplossBackgroundColor }}>
                  <label htmlFor='trailingStopPercent'>Stop Loss %</label>
                  <input className={'trailingstop-percent'} readOnly type='text' name='trailingStopPercent' value={this.trailingStopPercent} />
                  <label htmlFor='trailingStopPrice'>Stop Price</label>
                  <input className={'trailingstop-price'} readOnly type='text' name='trailingStopPrice' value={this.trailingStopPrice} />
                </div>
              </>
            ) : null}
            {/* {this.stoplossAlert ? <><br /><span className={'trailingstop-alert'}>Stop Loss</span></> : <br />} */}
          </form>

          <div className='dashboard-securityname'>
            <div>
              {this.companyName !== undefined ? (
                <span onClick={this.handleCompanyDataRequest} className='companyName'>
                  {this.companyName}
                </span>
              ) : null}
            </div>
          </div>
          <div className='dashboard-footer'>
            {/* {process.env.NODE_ENV === 'development' ? <div className={'trailingStopBasis-absolute'}>{this.trailingStopBasis}</div> : ''} */}
            {/* {this.lastSma40 ? <div className={'lastSma40Value-absolute'}>{this.lastSma40.close.toFixed(2)}</div> : <div className={'lastSma40Value-absolute'}>none</div>} */}
            {/* {this.lastSma40 && process.env.NODE_ENV === 'development' ? <div className={'lastSma40Value-absolute'}>{this.lastSma40.close.toFixed(2)}</div> : ''} */}

            <div>
              <ActionButton onClick={this.handleOrderEntry}>
                {this.buttonLabel} {this.symbol}
              </ActionButton>
            </div>
            <button onClick={this.handleEditDialogOpen} className={'dashboard-button-pencil-image-absolute'}>
              <img
                alt=''
                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVDhP1ZDBCYQwFAWzF2FtQbAMYT1pZXraKjzK3rcBrcI+7EDnRXMR1hgPKw4M8oT38xPzbzJ8Y2RTICmOOOEXg4Yk67dGDZDa5BAv1MmVTcsQZV3Hiyu7U90Qt9Eu27JU1lt4+VXWfy85XlMWT/zgqXKBD9QjtaiyNjpMjw1qSIxBZTFgh6VNN8GYGaGaLE+Bi37NAAAAAElFTkSuQmCC'
              />
            </button>
          </div>
        </div>
      </div>
    )
  }
}
ChartDashboard.propTypes = {
  handleOrderEntry: PropTypes.func.isRequired,
  cellObject: PropTypes.object.isRequired,
  iexData: PropTypes.number.isRequired,
  useSandbox: PropTypes.bool,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(ChartDashboard)
