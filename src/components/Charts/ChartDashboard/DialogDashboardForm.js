// ChartDashboard/DialogDashboardForm.js

import React, { Component } from 'react'
import dialogPolyfill from 'dialog-polyfill'
import './dialogdashboardform.css'
// import './styles.css'

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
    return (
      <dialog id={'dialog-params' + this.hash} className={'dialog-form'}>
        <span className={'dialog-symbol'}> {this.symbol} - Make Your Changes Below.</span>
        <br />
        <br />
        <form method="dialog">
          <label htmlFor="watched">Watched</label>
          <input type="text" name="watched" value={this.state.watched} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="watchedPrice">Watched Price</label>
          <input type="text" name="watchedPrice" value={this.state.watchedPrice} onChange={this.handleInputChange} />
          <br />
          {/* ================================================ */}
          {this.listGroup === 'positions' || this.listGroup === 'trades' ? (
            <span>
              <label htmlFor="entered">Entered</label>
              <input type="text" name="entered" value={this.state.entered} onChange={this.handleInputChange} />
              <br />
              <label htmlFor="enteredPrice">Entered Price</label>
              <input type="text" name="enteredPrice" value={this.state.enteredPrice} onChange={this.handleInputChange} />
              <br />
              <label htmlFor="filledQuantity">Quantity</label>
              <input type="text" name="filledQuantity" value={this.state.filledQuantity} onChange={this.handleInputChange} />
              <br />
            </span>
          ) : null}
          <br />
          {/* ================================================ */}
          <label htmlFor="session">Session</label>
          <input type="text" name="session" value={this.state.session} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="instruction">Instruction</label>
          <input type="text" name="instruction" value={this.state.instruction} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="quantity">Quantity</label>
          <input type="text" name="quantity" value={this.state.quantity} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="quantityType">Quantity Type</label>
          <input type="text" name="quantityType" value={this.state.quantityType} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="orderType">Order Type</label>
          <input type="text" name="orderType" value={this.state.orderType} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="duration">Duration</label>
          <input type="text" name="duration" value={this.state.duration} onChange={this.handleInputChange} />
          <br />
          <br />
          {/* ================================================ */}
          <button
            type="submit"
            onClick={() => {
              this.exitCallback(null)
              // this.dialogDashboardParams.close()
            }}>
            Cancel
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            type="submit"
            onClick={() => {
              this.exitCallback(this.state)
              // this.dialogDashboardParams.close()
            }}>
            Save
          </button>
        </form>
      </dialog>
    )
  }
}

export default DialogDashboardForm
