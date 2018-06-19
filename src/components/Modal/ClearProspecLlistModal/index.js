// ClearProspecLlistModal/index.js

import React from 'react'

const ClearProspecLlistModal = function(props) {
  let { targetListName } = props

  if (targetListName.toUpperCase() === 'SWING BUYS') {
    targetListName = 'Swing Buys'
  } else if (targetListName.toUpperCase() === 'SWING SELLS') {
    targetListName = 'Swing Sells'
  } else if (targetListName.toUpperCase() === 'TREND BUYS') {
    targetListName = 'Trend Buys'
  } else {
    alert('ERROR Missing targetListName in ClearProspecLlistModal')
    // debugger
  }

  const dialogHeader = `Confirm Deletion Of The ${targetListName} Prospects`
  let dialogContent = (
    <span>
      <p>
        All symbols in the {targetListName} prospect list will be deleted.<br />
        This data will be lost and cannot be restored.
      </p>
      <p>Are you sure you want to delete this list?</p>
    </span>
  )

  return (
    <div>
      <div style={props.backdropStyle}>
        <div className="mp-modal-grid">
          <div role="dialog" className="mp-modal-dialog">
            <header>
              <span>{dialogHeader}</span>
              {/* <button onClick={() => props.handleClose()} type="button" aria-label="close"> CLOSE </button> */}
            </header>
            <div className="mp-modal-content">
              <div className="mp-modal-dialog-content">{dialogContent}</div>
            </div>
            <footer>
              <button onClick={() => props.handleClick('yes')} type="button" aria-label="yes">
                Yes
              </button>
              <button onClick={() => props.handleClick('no')} type="button" aria-label="no">
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ClearProspecLlistModal
