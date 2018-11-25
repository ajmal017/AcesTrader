//TradeCell/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { querydeleteTradeObject } from '../../../redux/reducerModal'
import { removeResultFromList } from '../../../redux/reducerResults'
import DialogTradeForm from './DialogTradeForm'
import { editListObjectPrarmetersAsync } from '../../../redux/thunkEditListObjects'
import './styles.css'

// {/* <span id={'gaininfo'}>
//   {tradeDollarGain < 0 ? 'Loss' : 'Gain'} &nbsp;&nbsp;&nbsp; ${this.numberWithCommas(tradeDollarGain)}
//   &nbsp;&nbsp;&nbsp;&nbsp; {this.tradePercentGain}%{/*&nbsp;&nbsp;&nbsp;&nbsp;  Account: {account}  */}
// </span>  */}>

function TradeStatusLine({ hash, tradeSide, tradeDollarGain, tradePercentGain }) {
  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return tradeSide === 'Shorts' ? (
    <div>
      <span id={'gaininfo' + hash} className='watched'>
        {tradeDollarGain > 0 ? 'Loss' : 'Gain'} &nbsp;&nbsp;&nbsp; {tradeDollarGain > 0 ? '-' : ''}${numberWithCommas(Math.abs(tradeDollarGain))}
        &nbsp;&nbsp;&nbsp;&nbsp; {tradePercentGain}%
      </span>
    </div>
  ) : (
    <div>
      <span id={'gaininfo' + hash} className='watched'>
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
    this.handleEditDialogOpen = this.handleEditDialogOpen.bind(this)
    this.handleEditDialogClose = this.handleEditDialogClose.bind(this)
    this.state = { showDialog: false }
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
  handleEditDialogOpen(event) {
    this.setState({
      showDialog: true,
    })
  }

  handleEditDialogClose(returnValue) {
    if (returnValue) {
      // the returnValue is null if cancelled, else
      // the returnValue is an object with key/value pairs for each form field: {name: value, name: value, ...}
      this.props.dispatch(editListObjectPrarmetersAsync(this.hash, returnValue))
    }
    this.setState({
      showDialog: false,
    })
  }

  // this.tradePercentGain > 0 ? 0.8 : 0.6  // 250,82,82

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  render() {
    const tradeObject = this.props.tradeObject
    this.hash = tradeObject.hash
    this.listGroup = tradeObject.listGroup
    const symbol = tradeObject.symbol
    const entered = tradeObject.entered
    const exited = tradeObject.exited
    this.tradeSide = tradeObject.dashboard.tradeSide
    const enteredPrice = tradeObject.enteredPrice
    const exitedPrice = tradeObject.exitedPrice
    const filledQuantity = tradeObject.filledQuantity
    this.tradePercentGainTemp = exitedPrice !== 'pending' ? ((100 * (exitedPrice - enteredPrice)) / enteredPrice).toFixed(1) : 'pending'
    this.tradePercentGain = this.tradeSide === 'Shorts' ? -this.tradePercentGainTemp : this.tradePercentGainTemp
    this.tradeDollarGain = exitedPrice !== 'pending' ? (filledQuantity * (exitedPrice - enteredPrice)).toFixed(0) : 'pending'
    // const tradeGain = exitedPrice !== 'pending' ? (100 * (exitedPrice - enteredPrice)) / enteredPrice + '%' : 'pending'
    // const account = tradeObject.account
    const cell_id = tradeObject.hash
    const wrapperId = 'wrapper-' + cell_id

    this.dialogTradeFormValues = {
      symbol: symbol,
      entered: entered,
      exited: exited,
      enteredPrice: enteredPrice,
      exitedPrice: exitedPrice,
      filledQuantity: filledQuantity,
    }

    return (
      <div id={wrapperId} className={`trade-cell-wrapper ${this.state.showDialog ? 'expanded' : ''} ${this.state.hide ? 'fadeout' : ''}`}>
        <DialogTradeForm
          showDialog={this.state.showDialog}
          hash={this.hash}
          symbol={this.symbol}
          formValues={this.dialogTradeFormValues}
          listGroup={this.listGroup}
          exitCallback={this.handleEditDialogClose}
        />
        {/* the TradCell's cell_id value is used by the "Scrollable" menu in the Apptoolbar */}
        <div id={cell_id} className='trade-cell'>
          <button onClick={this.handleEditDialogOpen} className={'button-pencil-image-absolute'}>
            <img
              alt=''
              src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVDhP1ZDBCYQwFAWzF2FtQbAMYT1pZXraKjzK3rcBrcI+7EDnRXMR1hgPKw4M8oT38xPzbzJ8Y2RTICmOOOEXg4Yk67dGDZDa5BAv1MmVTcsQZV3Hiyu7U90Qt9Eu27JU1lt4+VXWfy85XlMWT/zgqXKBD9QjtaiyNjpMjw1qSIxBZTFgh6VNN8GYGaGaLE+Bi37NAAAAAElFTkSuQmCC'
            />
          </button>
          <div className='trade-header'>
            <span className='trade-title-formatting'>{symbol}</span>
            <span className='tradeside-formatting'>Trade: {this.tradeSide}</span>
            <button onClick={this.handleDelete} className='trade-button' type='button' aria-label='delete'>
              &times;
            </button>
          </div>
          <TradeStatusLine hash={this.hash} tradeSide={this.tradeSide} tradeDollarGain={this.tradeDollarGain} tradePercentGain={this.tradePercentGain} />
          {/* <span id={'gaininfo'}>
            {tradeDollarGain < 0 ? 'Loss' : 'Gain'} &nbsp;&nbsp;&nbsp; ${this.numberWithCommas(tradeDollarGain)}
            &nbsp;&nbsp;&nbsp;&nbsp; {this.tradePercentGain}%
          </span>  */}
          <span>
            Enter Price: {enteredPrice}
            &nbsp;&nbsp;&nbsp; Exit Price: {exitedPrice}
            &nbsp;&nbsp;&nbsp; Quantity: {filledQuantity}
          </span>
          <span className={'footerRow'}>
            Entered: {entered}
            &nbsp;&nbsp;&nbsp; Exited: {exited}
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
