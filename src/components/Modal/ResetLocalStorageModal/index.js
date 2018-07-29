// ResetLocalStorageModal/index.js

import React from 'react'

const ResetLocalStorageModal = function(props) {
  const dialogHeader = 'Reset Your Local Storage?'
  const dialogContent = (
    <span>
      <p>
        Your application's state in local storage will be reset.<br />
        Your Prospects, Positions, and Results lists will be initialized. You will create them again.
      </p>
      <p>This is done to allow the lists to be created again with the latest format changes.</p>
      <p>Are you sure you want to continue with this reset?</p>
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
export default ResetLocalStorageModal
