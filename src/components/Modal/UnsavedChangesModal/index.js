// UnsavedChangesModal/index.js

import React from 'react'

const UnsavedChangesModal = function(props) {
  const dialogHeader = 'Lose Unsaved Changes?'
  const dialogContent = (
    <span>
      <p>
        You have unsaved changes in your current plan.<br />
        Current plan: <b>{props.currentPlanName}.</b>
      </p>
      <p>
        They will be lost if you continue to open the selected plan.<br />
        Selected plan: <b>{props.newPlanName}</b>.
      </p>
      {/* <p>Click "No" to cancel this open, and save your changes first.</p> */}
      {/* <p>Click "Yes" to continue to open, and lose your changes.</p> */}
      <p>Continue to open and lose your changes?</p>
    </span>
  )
  return (
    <div>
      <div style={props.backdropStyle}>
        <div className="mp-modal-grid">
          <div role="dialog" className="mp-modal-dialog">
            <header>
              <span>{dialogHeader}</span>
              {/* <button onClick={() => props.handleClose()} type="button" aria-label="close">
                CLOSE
              </button> */}
            </header>
            <div className="mp-modal-content">
              <div className="mp-modal-dialog-content">{dialogContent}</div>
            </div>
            <footer>
              <button onClick={() => props.handleClick('no')} type="button" aria-label="no">
                No
              </button>
              <button onClick={() => props.handleClick('yes')} type="button" aria-label="tes">
                Yes
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UnsavedChangesModal
