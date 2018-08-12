//DeleteTradeObjectModal/index.js

import React from 'react'

const DeleteTradeObjectModal = function(props) {
  const dialogHeader = 'Delete Trade Record?'
  const dialogContent = (
    <span>
      <p>
        This trade record will be deleted.
        <br />
        The trade data will be lost to AcesTrader forever,
        <br />
        but will still be available in your Ameritrade records.
      </p>
      <p>Are you sure you want to delete this record?</p>
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
export default DeleteTradeObjectModal
