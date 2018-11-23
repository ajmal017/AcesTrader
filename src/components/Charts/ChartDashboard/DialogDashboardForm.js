// ChartDashboard/DialogDashboardForm.js

import React, { Component } from 'react'
import dialogPolyfill from 'dialog-polyfill'
import './dialogdashboardform.css'

class DialogDashboardForm extends Component {
  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.dialogDashboardParams = null
    this.hash = props.hash
    this.symbol = props.symbol
    this.listGroup = props.listGroup
    this.exitCallback = props.exitCallback
    this.state = props.formValues
  }

  componentDidMount() {
    this.dialogDashboardParams = document.getElementById('dialog-params' + this.hash)
    dialogPolyfill.registerDialog(this.dialogDashboardParams) // Now dialog acts like a native <dialog>.
  }

  componentDidUpdate(prevProps) {
    if (this.props.showDialog !== prevProps.showDialog) {
      if (this.props.showDialog) {
        this.dialogDashboardParams.showModal()
        // Move the focus away from the text input to prevent the iPad keyboard from popping up
        let el1 = document.getElementById('dialog-params' + this.hash)
        let el2 = el1.getElementsByClassName('dialog-button')
        el2[1].focus()
      } else {
        this.dialogDashboardParams.close()
      }
    }
    if (this.props.formValues !== prevProps.formValues) {
      this.setState(this.props.formValues)
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

  render() {
    const showConfirm = this.props.showConfirm
    let dialogContent
    if (showConfirm) {
      dialogContent = (
        <ConfirmDialog
          handleInputChange={this.handleInputChange}
          symbol={this.props.symbol}
          listGroup={this.props.listGroup}
          exitCallback={this.props.exitCallback}
          formValues={this.state}
        />
      )
    } else {
      dialogContent = (
        <EditDialog
          handleInputChange={this.handleInputChange}
          symbol={this.props.symbol}
          listGroup={this.props.listGroup}
          exitCallback={this.props.exitCallback}
          formValues={this.state}
        />
      )
    }
    return (
      <dialog id={'dialog-params' + this.hash} className={'dialog-form'}>
        {dialogContent}
      </dialog>
    )
  }
}

function ConfirmDialog(props) {
  const symbol = props.symbol
  const instruction = props.formValues.instruction
  const quantity = props.formValues.quantity
  const quantityType = !isNaN(quantity) ? props.formValues.quantityType : ''
  const orderType = props.formValues.orderType

  const durationDay = props.formValues.duration === 'DAY' ? 'good the Day' : null
  const durationGC = props.formValues.duration === 'GTC' ? 'good til Cancelled' : null
  const duration = durationDay ? durationDay : durationGC ? durationGC : null

  return (
    <>
      <div className={'confirm-symbol'}> {symbol} - Confirm your order before submitting.</div>
      <form method='dialog'>
        <div className={'order-pending'}>
          <p>{`${instruction} ${quantity} ${quantityType} of ${symbol} at ${orderType} ${duration}`}</p>
        </div>
        <scan className={'dialog-button-row'}>
          <button
            className={'dialog-button'}
            type='submit'
            onClick={() => {
              props.exitCallback(null)
              // props.dialogDashboardParams.close()
            }}>
            Cancel
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            className={'dialog-button'}
            type='submit'
            onClick={() => {
              props.exitCallback({ action: 'confirm' })
            }}>
            Confirm
          </button>
        </scan>
      </form>
    </>
  )
}
function EditDialog(props) {
  return (
    <>
      <span className={'edit-symbol'}> {props.symbol} - Make Your Changes Below.</span>
      <form method='dialog'>
        {props.formValues.listGroup === 'prospects' ? (
          <span>
            <label htmlFor='watched'>Watched</label>
            <input type='text' name='watched' value={props.formValues.watched} onChange={props.handleInputChange} />
            <br />
            <label htmlFor='watchedPrice'>Watched Price</label>
            <input type='text' name='watchedPrice' value={props.formValues.watchedPrice} onChange={props.handleInputChange} />
            <br />
          </span>
        ) : null}
        {/* ================================================ */}
        {props.formValues.listGroup === 'positions' || props.formValues.listGroup === 'trades' ? (
          <span>
            <label htmlFor='entered'>Entered</label>
            <input type='text' name='entered' value={props.formValues.entered} onChange={props.handleInputChange} />
            <br />
            <label htmlFor='enteredPrice'>Entered Price</label>
            <input type='text' name='enteredPrice' value={props.formValues.enteredPrice} onChange={props.handleInputChange} />
            <br />
            <label htmlFor='filledQuantity'>Quantity</label>
            <input type='text' name='filledQuantity' value={props.formValues.filledQuantity} onChange={props.handleInputChange} />
            <br />
          </span>
        ) : null}
        <br />
        {/* ================================================ */}
        <label htmlFor='session'>Session</label>
        <input type='text' name='session' value={props.formValues.session} onChange={props.handleInputChange} />
        <br />
        <label htmlFor='instruction'>Instruction</label>
        <input type='text' name='instruction' value={props.formValues.instruction} onChange={props.handleInputChange} />
        <br />
        <label htmlFor='quantity'>Quantity</label>
        <input type='text' name='quantity' value={props.formValues.quantity} onChange={props.handleInputChange} />
        <br />
        <label htmlFor='quantityType'>Quantity Type</label>
        <input type='text' name='quantityType' value={props.formValues.quantityType} onChange={props.handleInputChange} />
        <br />
        <label htmlFor='orderType'>Order Type</label>
        <input type='text' name='orderType' value={props.formValues.orderType} onChange={props.handleInputChange} />
        <br />
        <label htmlFor='duration'>Duration</label>
        <input type='text' name='duration' value={props.formValues.duration} onChange={props.handleInputChange} />
        <br />
        <br />
        {/* ================================================ */}
        <scan className={'dialog-button-row'}>
          <button
            className={'dialog-button'}
            type='submit'
            onClick={() => {
              props.exitCallback(null)
              // props.dialogDashboardParams.close()
            }}>
            Cancel
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            className={'dialog-button'}
            type='submit'
            onClick={() => {
              props.exitCallback({ formFields: props.formValues, action: 'edit' })
            }}>
            Save
          </button>
        </scan>
      </form>
    </>
  )
}

export default DialogDashboardForm
