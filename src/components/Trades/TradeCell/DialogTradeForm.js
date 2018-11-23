// TradesView/DialogTradeForm.js

import React, { Component } from 'react'
import dialogPolyfill from 'dialog-polyfill'
import './dialogtradeform.css'
// import './styles.css'

class DialogTradeForm extends Component {
  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.dialogTradeParams = null
    this.hash = props.hash
    this.symbol = props.symbol
    this.listGroup = props.listGroup
    this.exitCallback = props.exitCallback
    this.state = props.formValues
  }

  componentDidMount() {
    this.dialogTradeParams = document.getElementById('dialog-params' + this.hash)
    dialogPolyfill.registerDialog(this.dialogTradeParams) // Now dialog acts like a native <dialog>.
  }

  componentDidUpdate(prevProps) {
    if (this.props.showDialog !== prevProps.showDialog) {
      if (this.props.showDialog) {
        this.dialogTradeParams.showModal()
      } else {
        this.dialogTradeParams.close()
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
    return (
      <dialog id={'dialog-params' + this.hash}>
        <span className={'edit-symbol'}> {this.state.symbol} - Make Your Changes Below.</span>
        <br />
        <br />
        <form method='dialog' className={'dialog-form'}>
          {/* <span> */}
          <label htmlFor='enteredPrice'>Entered Price</label>
          <input type='text' name='enteredPrice' value={this.state.enteredPrice} onChange={this.handleInputChange} />
          <br />
          <label htmlFor='exitedPrice'>Exited Price</label>
          <input type='text' name='exitedPrice' value={this.state.exitedPrice} onChange={this.handleInputChange} />
          <br />
          <label htmlFor='entered'>Entered</label>
          <input type='text' name='entered' value={this.state.entered} onChange={this.handleInputChange} />
          <br />
          <label htmlFor='exited'>Exited</label>
          <input type='text' name='exited' value={this.state.exited} onChange={this.handleInputChange} />
          <br />
          <label htmlFor='filledQuantity'>Quantity</label>
          <input type='text' name='filledQuantity' value={this.state.filledQuantity} onChange={this.handleInputChange} />
          <br />
          {/* </span> */}
          <br />
          <button
            type='submit'
            onClick={() => {
              this.exitCallback(null)
            }}>
            Cancel
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            type='submit'
            onClick={() => {
              this.exitCallback(this.state)
            }}>
            Save
          </button>
        </form>
      </dialog>
    )
  }
}

export default DialogTradeForm
