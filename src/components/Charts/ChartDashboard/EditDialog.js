// EditDialog.js
import React, { Component } from 'react'
import './stylesTextWidths.css'

const EditDialog = (props) => {
  const listGroup = props.listGroup
  const tradeSideLc = props.tradeSideLc
  return (
    <>
      <span className={'edit-symbol'}> {props.symbol} - Make Your Changes</span>
      <form method='dialog'>
        {props.listGroup === 'prospects' ? (
          <span>
            <br />
            <label htmlFor='watched'>Watched</label>
            <input type='text' name='watched' value={props.formValues.watched} onChange={props.handleInputChange} />
            <label htmlFor='watchedPrice'>Watched Price</label>
            <input type='text' name='watchedPrice' value={props.formValues.watchedPrice} onChange={props.handleInputChange} />
            <br />
          </span>
        ) : null}
        {/* ================================================ */}
        {props.listGroup === 'positions' || props.listGroup === 'trades' ? (
          <span>
            <br />
            <label htmlFor='entered'>Entered</label>
            <input type='text' name='entered' value={props.formValues.entered} onChange={props.handleInputChange} />
            <label htmlFor='enteredPrice'>Entered Price</label>
            <input type='text' name='enteredPrice' value={props.formValues.enteredPrice} onChange={props.handleInputChange} />
            <label htmlFor='filledQuantity'>Quantity</label>
            <input type='text' name='filledQuantity' value={props.formValues.filledQuantity} onChange={props.handleInputChange} />
            <br />
          </span>
        ) : null}
        <br />
        <label htmlFor='instruction'>Order</label>
        <input className={'instruction-' + props.tradeSideLc} type='text' name='instruction' value={props.formValues.instruction} onChange={props.handleInputChange} />
        <label htmlFor='orderType'>Order Type</label>
        <input className={'ordertype-' + props.tradeSideLc} type='text' name='orderType' value={props.formValues.orderType} onChange={props.handleInputChange} />
        <br />
        <label htmlFor='quantity'>Quantity</label>
        <input className={'quantity-' + props.tradeSideLc} type='text' name='quantity' value={props.formValues.quantity} onChange={props.handleInputChange} />
        <label htmlFor='quantityType'>Quantity Type</label>
        <input className={'quantitytype-' + props.tradeSideLc} type='text' name='quantityType' value={props.formValues.quantityType} onChange={props.handleInputChange} />
        <br />
        <label htmlFor='session'>Session</label>
        <input className={'session-' + props.tradeSideLc} type='text' name='session' value={props.formValues.session} onChange={props.handleInputChange} />
        <label htmlFor='duration'>Duration</label>
        <input className={'duration-' + props.tradeSideLc} type='text' name='duration' value={props.formValues.duration} onChange={props.handleInputChange} />
        <br />
        <br />
        {/* ================================================ */}
        <span className={'dialog-button-row'}>
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
        </span>
      </form>
    </>
  )
}
export default EditDialog
