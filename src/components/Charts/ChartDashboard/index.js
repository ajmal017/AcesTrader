// ChartDashboard/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import DialogDashboardForm from './DialogDashboardForm'
import { editListObjectPrarmetersAsync } from '../../../redux/thunkEditListObjects'
import './styles.css'

function PeekStatusLine({ hash, listGroup, peekDate, peekPrice, dollarGain, percentGain, daysHere, positionValue, rgbaValue }) {
  // let thePositionValue = listGroup === 'positions' ? `, Value: ${positionValue}` : null
  return peekDate !== undefined ? (
    <div style={{ backgroundColor: 'rgba(' + rgbaValue + ')' }}>
      <span id={'positions' + hash} className='watched'>
        Peek {peekDate} @{peekPrice}
        ,&nbsp;&nbsp;Change:&nbsp;
        {percentGain}
        %,&nbsp;&nbsp;
        {daysHere} days
        {/* {thePositionValue} */}
      </span>
    </div>
  ) : null
}

class ChartDashboard extends Component {
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
        this.props.dispatch(editListObjectPrarmetersAsync(this.hash, returnValue.formFields))
      } else if (returnValue.action === 'confirm') {
        this.props.handleEntry() // the order entry was confirmed
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

    this.instructionRaw = this.props.cellObject.dashboard.instruction
    this.instructionTest = this.tradeSide === 'Shorts' ? true : false
    this.instruction = this.instructionTest ? 'COVER' : this.instructionRaw

    const startPrice = this.listGroup === 'positions' ? this.enteredPrice : this.watchedPrice
    this.dollarGain = this.peekDate !== undefined ? (this.peekPrice - startPrice).toFixed(2) : 'pending'
    this.percentGain = this.peekDate !== undefined ? ((100 * (this.peekPrice - startPrice)) / startPrice).toFixed(1) : 'pending'
    this.positionValue = this.peekDate !== undefined ? this.numberWithCommas((this.filledQuantity * this.peekPrice).toFixed(0)) : 'pending'

    this.rgbColor = this.percentGain > 0 ? '0,255,0' : '255,107,107'
    this.rgbOpacity = Math.min(Math.abs(this.percentGain / 100) * 20, 0.8)
    this.rgbaValue = this.rgbColor + ',' + this.rgbOpacity

    const startDate = this.listGroup === 'positions' ? new Date(this.entered) : new Date(this.watched)
    const endDate = new Date(this.peekDate)
    const timeDiff = endDate - startDate
    this.daysHere = Math.round(Math.abs(timeDiff / (1000 * 3600 * 24)))

    this.tradeSideLc = this.tradeSide.toLowerCase().replace(/[\W_]/g, '')

    // /* Dashboard text input widths for Prospects */

    // session-Buys { width: 62;}

    // .dashboard-form .session-ShortSales {
    //   width: 62px;
    // }
    // .dashboard-form .session-TrendBuys {
    //   width: 62px;
    // }
    // .dashboard-form .instruction-Buys {
    //   width: 40px;
    // }
    // .dashboard-form .instruction-ShortSales {
    //   width: 78px;
    // }
    // .dashboard-form .instruction-TrendBuys {
    //   width: 40px;
    // }
    // .dashboard-form .quantity-Buys {
    //   width: 50px;
    // }
    // .dashboard-form .quantity-ShortSales {
    //   width: 50px;
    // }
    // .dashboard-form .quantity-TrendBuys {
    //   width: 50px;
    // }
    // .dashboard-form .quantitytype-Buys {
    //   width: 68px;
    // }
    // .dashboard-form .quantitytype-ShortSales {
    //   width: 68px;
    // }
    // .dashboard-form .quantitytype-TrendBuys {
    //   width: 68px;
    // }
    // .dashboard-form .ordertype-Buys {
    //   width: 62px;
    // }
    // .dashboard-form .ordertype-ShortSales {
    //   width: 62px;
    // }
    // .dashboard-form .ordertype-TrendBuys {
    //   width: 62px;
    // }
    // .dashboard-form .duration-Buys {
    //   width: 40px;
    // }
    // .dashboard-form .duration-ShortSales {
    //   width: 40px;
    // }
    // .dashboard-form .duration-TrendBuys {
    //   width: 40px;
    // }

    // /* Dashboard text input widths for Positions */

    // .dashboard-form .session-Longs {
    //   width: 62px;
    // }
    // .dashboard-form .session-Shorts {
    //   width: 62px;
    // }
    // .dashboard-form .session-TrendLongs {
    //   width: 62px;
    // }
    // .dashboard-form .instruction-Longs {
    //   width: 40px;
    // }
    // .dashboard-form .instruction-Shorts {
    //   width: 58px;
    // }
    // .dashboard-form .instruction-TrendLongs {
    //   width: 40px;
    // }
    // .dashboard-form .quantity-Longs {
    //   width: 86px;
    // }
    // .dashboard-form .quantity-Shorts {
    //   width: 86px;
    // }
    // .dashboard-form .quantity-TrendLongs {
    //   width: 86px;
    // }
    // .dashboard-form .quantitytype-Longs {
    //   width: 58px;
    // }
    // .dashboard-form .quantitytype-Shorts {
    //   width: 58px;
    // }
    // .dashboard-form .quantitytype-TrendLongs {
    //   width: 58px;
    // }
    // .dashboard-form .ordertype-Longs {
    //   width: 62px;
    // }
    // .dashboard-form .ordertype-Shorts {
    //   width: 62px;
    // }
    // .dashboard-form .ordertype-TrendLongs {
    //   width: 62px;
    // }
    // .dashboard-form .duration-Longs {
    //   width: 40px;
    // }
    // .dashboard-form .duration-Shorts {
    //   width: 40px;
    // }
    // .dashboard-form .duration-TrendLongs {
    //   width: 40px;
    // }

    this.dialogDashboardFormValues = {
      watched: this.watched,
      watchedPrice: this.watchedPrice,
      entered: this.entered,
      enteredPrice: this.enteredPrice,
      filledQuantity: this.filledQuantity,
      session: this.session,
      instruction: this.instruction,
      quantity: this.quantity,
      quantityType: this.quantityType,
      orderType: this.orderType,
      duration: this.duration,
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
          exitCallback={this.handleEditDialogClose}
        />
        <div className='dashboard-data'>
          {/* <span className="dashboard-header">{this.tradeSide}</span> */}
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
                    &nbsp;&nbsp; Price {this.enteredPrice}
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
            </div>
            {/* Use regex below to strip out spaces in tradeSideLc names for use in CSS selectors */}
            <label htmlFor='session'>Session</label>
            <input className={'session-' + this.tradeSideLc.replace(/[\W_]/g, '')} readOnly type='text' name='session' value={this.session} />
            <label htmlFor='instruction'>Instruction</label>
            <input className={'instruction-' + this.tradeSideLc.replace(/[\W_]/g, '')} readOnly type='text' name='instruction' value={this.instruction} />
            <br />
            <label htmlFor='quantity'>Quantity</label>
            <input className={'quantity-' + this.tradeSideLc.replace(/[\W_]/g, '')} readOnly type='text' name='quantity' value={this.quantity} />
            <label htmlFor='quantityType'>Type</label>
            <input className={'quantitytype-' + this.tradeSideLc.replace(/[\W_]/g, '')} readOnly type='text' name='quantityType' value={this.quantityType} />
            <br />
            <label htmlFor='orderType'>OrderType</label>
            <input className={'ordertype-' + this.tradeSideLc.replace(/[\W_]/g, '')} readOnly type='text' name='orderType' value={this.orderType} />
            <label htmlFor='duration'>Duration</label>
            <input className={'duration-' + this.tradeSideLc.replace(/[\W_]/g, '')} readOnly type='text' name='duration' value={this.duration} />
          </form>

          <div className='dashboard-footer'>
            <div className='order-entry-button'>
              <button onClick={this.handleOrderEntry} className='entry-order-button'>
                {this.buttonLabel} {this.symbol}
              </button>
            </div>
            <button onClick={this.handleEditDialogOpen} className={'button-pencil-image-absolute'}>
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
  handleEntry: PropTypes.func.isRequired,
  cellObject: PropTypes.object.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(ChartDashboard)
