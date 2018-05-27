// DeleteUserPlanModal/index.js

import React from 'react'

const DeleteUserPlanModal = function(props) {
  const { targetPlanName, currentPlanName, dirty } = props
  const dialogHeader = 'Confirm Plan Deletion'
  let dialogContent
  if (dirty && targetPlanName === currentPlanName) {
    dialogContent = (
      <span>
        <p>
          You have unsaved changes in the plan to be deleted.<br />
          This data will be lost and cannot be undone.
        </p>
        <p>
          Plan name: <b>{targetPlanName}.</b>
          <br />
          Are you sure you want to delete this plan?
        </p>
      </span>
    )
  } else {
    dialogContent = (
      <span>
        <p>
          Plan name: <b>{targetPlanName}.</b>
          <br />
          Are you sure you want to delete this plan?
        </p>
      </span>
    )
  }

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
export default DeleteUserPlanModal
