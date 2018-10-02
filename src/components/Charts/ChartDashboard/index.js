// ChartDashboard/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import dialogPolyfill from 'dialog-polyfill'
import './styles.css'

function PeekStatusLine({ hash, listGroup, peekDate, peekPrice, dollarGain, percentGain, positionValue }) {
  return peekDate !== undefined && listGroup === 'prospects' ? (
    <div>
      <span id={'prospects' + hash} className="watched">
        Peek {peekDate} @{peekPrice}, &nbsp;&nbsp; Change:&nbsp; {percentGain}%
      </span>
    </div>
  ) : peekDate !== undefined && listGroup === 'positions' ? (
    <div>
      <span id={'positions' + hash} className="watched">
        Peek {peekDate} @{peekPrice}
        ,&nbsp;&nbsp; Change:&nbsp; {percentGain}
        %,&nbsp;&nbsp; Value:&nbsp; ${positionValue}
      </span>
    </div>
  ) : null
}

class ChartDashboard extends Component {
  constructor(props) {
    super(props)
    this.handleEditDashboardParams = this.handleEditDashboardParams.bind(this)
    this.dialogDashboardParams
    this.state = {}
  }

  componentDidMount() {
    let el = document.getElementById(this.listGroup + this.hash)
    if (el !== null) {
      let rgbColor = this.percentGain > 0 ? '0,255,0' : '255,107,107'
      let rgbOpacity = Math.min(Math.abs(this.percentGain / 100) * 20, 0.8)
      el.setAttribute('style', `background-color: rgba(${rgbColor}, ${rgbOpacity})`)
    }
    this.dialogDashboardParams = document.getElementById('dashboard-params' + this.hash)
    dialogPolyfill.registerDialog(this.dialogDashboardParams) // Now dialog acts like a native <dialog>.
  }

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  readEvent(event) {
    let data = []
    for (let k = 0; k < event.target.childNodes[3].length; k++) {
      let text = event.target.childNodes[3][k].outerHTML
      // Examples of the text recovered from outerHTML:
      // <input type="text" name="watched" value="9/27/2018"></input>
      // <input type="text" name="watchedPrice" value="51.28">
      // <input type="text" name="session" value="NORMAL">
      let result = /.* name="(.*)" value="(.*)">/.exec(text)
      if (result === null) {
        break
      }
      let inputJson = '{"name":"' + result[1] + '","value":"' + result[2] + '"}'
      let obj = JSON.parse(inputJson)
      data.push(obj)
    }
    return data
  }

  handleEditDashboardParams(event) {
    this.dialogDashboardParams.showModal()
    let self = this
    this.dialogDashboardParams.addEventListener('close', function(event) {
      if (self.dialogDashboardParams.returnValue === 'yes') {
        let data = self.readEvent(event)
        data.map((item) => {
          let name = item.name
          let value = item.value
          self[name] = value
        })
        debugger
      }
    })
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
    this.instruction = this.props.cellObject.dashboard.instruction
    this.buttonLabel = this.props.cellObject.dashboard.buttonLabel // this.instruction

    const startPrice = this.listGroup === 'positions' ? this.enteredPrice : this.watchedPrice
    this.dollarGain = this.peekDate !== undefined ? (this.peekPrice - startPrice).toFixed(2) : 'pending'
    this.percentGain = this.peekDate !== undefined ? ((100 * (this.peekPrice - startPrice)) / startPrice).toFixed(1) : 'pending'
    this.positionValue = this.peekDate !== undefined ? this.numberWithCommas((this.filledQuantity * this.peekPrice).toFixed(0)) : 'pending'

    return (
      <div className="dashboard">
        <dialog id={'dashboard-params' + this.hash} className={'dashboard-edit-form'}>
          <span className={'dialog-symbol'}> {this.symbol} - Make Your Changes Below.</span>
          <br />
          <br />
          <form method="dialog">
            <label htmlFor="watched">Watched</label>
            <input type="text" name="watched" value={this.watched} />
            <br />
            <label htmlFor="watchedPrice">WatchedPrice</label>
            <input type="text" name="watchedPrice" value={this.watchedPrice} />
            <br />
            {this.listGroup === 'positions' ? (
              <span>
                <label htmlFor="entered">Entered</label>
                <input type="text" name="entered" value={this.entered} />
                <br />
                <label htmlFor="enteredPrice">EnteredPrice</label>
                <input type="text" name="enteredPrice" value={this.enteredPrice} />
                <br />
                <label htmlFor="filledQuantity">FilledQuantity</label>
                <input type="text" name="filledQuantity" value={this.filledQuantity} />
                <br />
              </span>
            ) : null}
            <br />
            <label htmlFor="session">Session</label>
            <input type="text" name="session" value={this.session} />
            <br />
            <label htmlFor="instruction">Instruction</label>
            <input type="text" name="instruction" value={this.instruction} />
            <br />
            <label htmlFor="quantity">Quantity</label>
            <input type="text" name="quantity" value={this.quantity} />
            <br />
            <label htmlFor="quantityType">QuantityType</label>
            {/* <select>
              <option />
              <option>Shares</option>
              <option>Dollars</option>
            </select> */}
            <input type="text" name="quantityType" value={this.quantityType} />
            <br />
            <label htmlFor="orderType">OrderType</label>
            <input type="text" name="orderType" value={this.orderType} />
            <br />
            <label htmlFor="duration">Duration</label>
            <input type="text" name="duration" value={this.duration} />
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
        <div className="dashboard-data">
          <span className="dashboard-header">{this.tradeSide}</span>
          <form className="dashboard-form">
            <div className="events-log">
              <PeekStatusLine
                hash={this.hash}
                listGroup={this.listGroup}
                peekDate={this.peekDate}
                peekPrice={this.peekPrice}
                dollarGain={this.dollarGain}
                percentGain={this.percentGain}
                positionValue={this.positionValue}
              />

              <div>
                <span className="watched">
                  Watched {this.watched} @{this.watchedPrice}
                </span>
                {this.entered !== undefined ? (
                  <span className="entered">
                    Entered {this.entered}
                    &nbsp;&nbsp; Price {this.enteredPrice}
                  </span>
                ) : null}
                {/* </div>
              <div> */}
                {this.filledQuantity !== undefined ? (
                  <span className="filledquantity">
                    Quantity {this.filledQuantity}
                    {/* &nbsp;&nbsp; Account {this.account} */}
                  </span>
                ) : null}
                {/* <div className={'dialog-button-wrapper'}>
                  <button onClick={this.handleEditDashboardStatus} className={'button-pencil-image'}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVDhP1ZDBCYQwFAWzF2FtQbAMYT1pZXraKjzK3rcBrcI+7EDnRXMR1hgPKw4M8oT38xPzbzJ8Y2RTICmOOOEXg4Yk67dGDZDa5BAv1MmVTcsQZV3Hiyu7U90Qt9Eu27JU1lt4+VXWfy85XlMWT/zgqXKBD9QjtaiyNjpMjw1qSIxBZTFgh6VNN8GYGaGaLE+Bi37NAAAAAElFTkSuQmCC" />
                  </button>
                </div> */}
              </div>
            </div>
            <label htmlFor="session">Session</label>
            <input readonly type="text" name="session" value={this.session} />
            <label htmlFor="instruction">Instruction</label>
            <input readonly type="text" name="instruction" value={this.instruction} />
            <br />
            <label htmlFor="quantity">Quantity</label>
            <input readonly type="text" name="quantity" value={this.quantity} />
            <label htmlFor="quantityType">QuantityType</label>
            <input readonly type="text" name="quantityType" value={this.quantityType} />
            <br />
            <label htmlFor="orderType">OrderType</label>
            <input readonly type="text" name="orderType" value={this.orderType} />
            <label htmlFor="duration">Duration</label>
            <input readonly type="text" name="duration" value={this.duration} />
          </form>

          <div className="dashboard-footer">
            <div className="order-entry-button">
              <button onClick={this.props.handleEntry} className="entry-order-button">
                {this.buttonLabel} {this.symbol}
              </button>
            </div>
            <button onClick={this.handleEditDashboardParams} className={'button-pencil-image-absolute'}>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVDhP1ZDBCYQwFAWzF2FtQbAMYT1pZXraKjzK3rcBrcI+7EDnRXMR1hgPKw4M8oT38xPzbzJ8Y2RTICmOOOEXg4Yk67dGDZDa5BAv1MmVTcsQZV3Hiyu7U90Qt9Eu27JU1lt4+VXWfy85XlMWT/zgqXKBD9QjtaiyNjpMjw1qSIxBZTFgh6VNN8GYGaGaLE+Bi37NAAAAAElFTkSuQmCC" />
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
