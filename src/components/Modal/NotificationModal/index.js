// NotificationModal/index.js

import React from 'react'

const NotificationModal = function(props) {
  let dialogHeader
  let dialogContent

  // build the modal content for the specified noticeCode value
  switch (props.noticeCode) {
    case 'noexport':
      dialogHeader = `Export Not Done`
      dialogContent = (
        <span>
          <p>
            Exporting a file to the Downloads folder<br />
            is not available with your configuration.<br />
          </p>
        </span>
      )
      break
    case 'exportedplan':
      dialogHeader = `Plan Exported`
      dialogContent = (
        <span>
          <p>
            A copy of the plan file has been exported.<br />
            The file has an extension of ".mpx".<br />
            Look for it in your Downloads folder.<br />
          </p>
        </span>
      )
      break
    case 'maxsaved':
      dialogHeader = `Saved Plans Limit`
      dialogContent = (
        <span>
          <p>
            Storage constraints limit saved plans to 5 max.<br />
            Replace one by using its name for this file.<br />
            Use the Save As... command to do that.<br />
            Or delete one first to allow this one to be saved.<br />
          </p>
        </span>
      )
      break
    case 'saveexample':
      dialogHeader = `Can Not Save Example Changes`
      dialogContent = (
        <span>
          <p>
            Changes to an example plan can not be saved.<br />
            An example plan needs a new name to be saved.<br />
            Use the Save As... command to do that.
          </p>
        </span>
      )
      break
    case 'saveuntitled':
      dialogHeader = `Can Not Save Untitled`
      dialogContent = (
        <span>
          <p>
            An untitled plan needs a name to save it.<br />
            Use the Save As... command to do that.
          </p>
        </span>
      )
      break
    case 'noplanopened':
      dialogHeader = `No Plan Opened`
      dialogContent = (
        <span>
          <p>
            There is no plan currently open.<br />
            So the Save As... command has nothing to save.
          </p>
        </span>
      )
      break
    case 'nochartinputdata':
      dialogHeader = `Unable To Provide Charting Now`
      dialogContent = (
        <span>
          <p>
            If you have a new plan without user data,<br />
            you need to provide data to create charts.<br />
            You can do that when the editing forms are finished.
          </p>
          <p>
            But even if your plan already has data entered, <br />
            we aren't able yet to run calculations to produce the charts.
          </p>
          <p>But for now you can click Select to load an example plan and see example charts.</p>
        </span>
      )
      break
    case 'dummyplanname':
      dialogHeader = `This Request Can Not Be Done`
      dialogContent = (
        <span>
          <p>
            Sorry, but these file names under the "Your Plans" list are dummy names.<br />
            They are just temporary place holders to assist in laying out the display.
          </p>
          <p>They can be removed by clicking the vertical menu button on the right and selecting Delete.</p>
          <p>After editing of plan data is available, you will be able to create user plans.</p>
          <p>To see examples of plans, use the "Example Plans" section.</p>
        </span>
      )
      break
    default:
      if (process.env.NODE_ENV === 'development') {
        debugger //developer testing
      }
  }
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
              <button onClick={() => props.handleClose()} type="button" aria-label="close">
                OK
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NotificationModal
