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
import { AuthenticatedContext } from '../../../redux'
import './styles.css'
import './stylesTextWidths.css'

function PeekStatusLine({ hash, listGroup, peekDate, peekPrice, dollarGain, percentGain, daysHere, positionValue, rgbaValue }) {
  // let thePositionValue = listGroup === 'positions' ? `, Value: ${positionValue}` : null
  let nd = new Date(peekDate)
  // const displayDate = `${1 + nd.getMonth()}/${nd.getDate()} ${nd.getHours()}:${nd.getMinutes()}`
  const displayDate = `${1 + nd.getMonth()}/${nd.getDate()} ${nd
    .toLocaleTimeString()
    .toLowerCase()
    .replace(/:\d\d\s/, '')}`
  const displayGain = percentGain > 0 ? `+${percentGain}` : `${percentGain}`
  return peekDate !== undefined ? (
    <div style={{ backgroundColor: 'rgba(' + rgbaValue + ')' }}>
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
    this.state = { showDialog: false, showConfirm: false }
  }

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  handleEditDialogOpen(event) {
    event.preventDefault()
    this.setState({
      showDialog: true,
      showConfirm: false,
    })
  }
  doConfirmDialogOpen() {
    this.setState({
      showDialog: true,
      showConfirm: true,
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
        this.props.handleOrderEntry() // the order entry was confirmed
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

  render() {
    //handle new props with changed state of cellObjects
    this.hash = this.props.cellObject.hash
    this.symbol = this.props.cellObject.symbol
    this.listGroup = this.props.cellObject.listGroup
    this.symbolDescription = this.props.cellObject.symbolDescription
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

    const defaultRgbaBackground = '206,212,218,0.3'
    const alertRgbaBackground = '255, 219, 77,0.8'
    const startPrice = this.listGroup === 'positions' ? this.enteredPrice : this.watchedPrice
    this.dollarGain = this.peekDate !== undefined ? (this.peekPrice - startPrice).toFixed(2) : 'pending'
    this.percentGain = this.peekDate !== undefined ? ((100 * (this.peekPrice - startPrice)) / startPrice).toFixed(1) : 'pending'
    this.positionValue = this.peekDate !== undefined ? this.numberWithCommas((this.filledQuantity * this.peekPrice).toFixed(0)) : 'pending'
    this.rgbColor = null
    this.rgbColor = this.percentGain > 0 ? '0,255,0' : '255,107,107'
    this.rgbOpacity = Math.min(Math.abs(this.percentGain / 100) * 20, 0.8)
    this.rgbaValue = this.rgbColor + ',' + this.rgbOpacity

    const startDate = this.listGroup === 'positions' ? new Date(this.entered) : new Date(this.watched)
    const endDate = new Date(this.peekDate)
    const timeDiff = endDate - startDate
    this.daysHere = Math.round(Math.abs(timeDiff / (1000 * 3600 * 24)))

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

    // **NOTE the condition on this.props.iexData which controls processing past this point**

    if (this.peekDate === undefined || this.props.iexData === 0) {
      this.rgbaBackground = defaultRgbaBackground // chart data not available yet, not able to test for any alert now
    } else {
      // When iexData > 0, it means chart data is available in Chartcell,
      // providing new props for ChartDashboard to calculate alerts and sma displays

      this.lastSma40 = getLastSma40Price(this.symbol)
      this.lastTradeSma = getLastSmaTradingPrice(this.symbol).toFixed(2)
      this.tradeSma = this.props.cellObject.dashboard.tradeSma
      this.daysInterval = this.props.cellObject.dashboard.daysInterval
      this.currentState = this.props.cellObject.dashboard.currentState

      const weekly = this.props.cellObject.weeklyBars
      if (weekly) {
        // Calculate action signal for trend following prospects and positions using weekly bar charts
        // Determine the status of the long term SMA40 buy/sell alert signals
        if (this.lastSma40) {
          // Flag any trend following alerts
          if (this.tradeSide !== 'Shorts') {
            if (this.listGroup === 'prospects') {
              this.rgbaBackground = this.peekPrice > this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trading buy OR default background
            }
            if (this.listGroup === 'positions') {
              this.rgbaBackground = this.peekPrice < this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trading sell OR default background
            }
          } else if (this.tradeSide === 'Shorts') {
            if (this.listGroup === 'prospects') {
              this.rgbaBackground = this.peekPrice < this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trading buy OR default background
            }
            if (this.listGroup === 'positions') {
              this.rgbaBackground = this.peekPrice > this.lastSma40.close ? alertRgbaBackground : defaultRgbaBackground // alert for trading sell OR default background
            }
          }
        }
      } else {
        // Daily bar charts get the appStateMachine signals
        // Prepare the parameters for use by stateMachine()
        this.testState = {
          SMA3: this.daysInterval, //fixed days count
          ET1: false, //enable crossover sell
          TS1: 4, //crossover sell %
          ET4: false, //enable crossover buy
          TS4: 4, //crossover buy %
          CLOSEONLY: false, //ohlc is available
        }
        const { nextState } = stateMachine(this.testState, this.symbol)
        this.nextState = nextState
        console.log(`nextState=${nextState}`)
        this.rgbaBackground = defaultRgbaBackground // only weekly bars charts get trend alerts
      }

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
        }
        // this.stoplossAlert = true // ***TEST TO ALWAYS SHOW ALERT FOR TRAILING STOP LOSS***
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
      symbolDescription: this.symbolDescription,
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
                {/* </div>
              <div> */}
                {this.filledQuantity !== undefined ? (
                  <span className='filledquantity'>
                    Quantity {this.filledQuantity}
                    {/* &nbsp;&nbsp; Account {this.account} */}
                  </span>
                ) : null}
              </div>
              <div>{this.lastSma40 ? <span className='weeklysma'>Weekly Sma(40): &nbsp;{this.lastSma40.close.toFixed(2)}</span> : null}</div>
            </div>

            {/* If current user is not a Guest user, then the content below */}
            {/* is removed until online access to broker trading API enabled */}
            {this.context && this.context.email !== 'a@g.com' ? (
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
                {/* <br /> */}
                <label htmlFor='trailingStopPercent'>Stop Loss %</label>
                <input className={'trailingstop-percent'} readOnly type='text' name='trailingStopPercent' value={this.trailingStopPercent} />
                <label htmlFor='trailingStopPrice'>Stop Price</label>
                <input className={'trailingstop-price'} readOnly type='text' name='trailingStopPrice' value={this.trailingStopPrice} />
              </>
            ) : null}

            {this.stoplossAlert ? <><br /><br /><span className={'trailingstop-alert'}>Stop Loss</span><br /><br /></> : <br />}

            <label htmlFor='tradeSma'>Trading Sma</label>
            <input className={'tradeSmaPeriod'} readOnly type='text' name='tradeSma' value={this.tradeSma} />
            <label htmlFor='lastTradeSma'>Last Trading Sma</label>
            <input className={'lastTradeSmaPrice'} readOnly type='text' name='lastTradeSma' value={this.lastTradeSma} />
            <br />
            <label htmlFor='daysInterval'>Fixed Days</label>
            <input className={'daysIntervalValue'} readOnly type='text' name='daysInterval' value={this.daysInterval} />
            <label htmlFor='currentState'>Current State</label>
            {/* <input className={'currentStateText'} readOnly type='text' name='currentState' value={this.currentState} /> */}
            <input className={'currentStateText'} readOnly type='text' name='currentState' value={this.nextState} />
            <br />

          </form>

          <div className='dashboard-securityname'>
            <div>{this.symbolDescription !== undefined ? <span className='symbolDescription'>{this.symbolDescription}</span> : null}</div>
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
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(ChartDashboard)
