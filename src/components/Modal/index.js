// Modal/index.js

// Modal framework from: https://www.nearform.com/blog/exploring-react-portals/

import React, { Component } from 'react'
import DeleteUserPlanModal from './DeleteUserPlanModal'
import UnsavedChangesModal from './UnsavedChangesModal'
import NotificationModal from './NotificationModal'
import './styles.css'

class Modal extends Component {
  state = {
    isDialogOpen: false,
  }

  // flag identifies the button that was clicked
  handleClick = (flag) => {
    this.sendResponse(flag)
  }

  handleClose = () => {
    this.sendResponse('close')
  }

  // this response includes all the data sent with the action dispatch, plus the flag
  // the calling component can determine what to do next depending on the buttonFlag
  sendResponse(flag) {
    this.setState({ isDialogOpen: false })
    //notifications do not send a response, they just are dismissed with an OK button
    if (this.props.dialogSelector.toLowerCase() !== 'notification') {
      let response = { ...this.props, buttonFlag: flag }
      this.props.handleModalResonse(response)
    }
  }

  // these props come from mapStateToProps in the parent component
  // every call to here with nextProps triggers a modal display
  componentWillReceiveProps(nextProps) {
    this.setState({ isDialogOpen: true })
  }

  render() {
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(33, 33, 33, 0.4)',
      zIndex: 1000,
    }
    let newprops = { ...this.props, handleClick: this.handleClick, handleClose: this.handleClose, backdropStyle: backdropStyle }
    return this.state.isDialogOpen ? this.modalPage(newprops) : null
  }

  modalPage(props) {
    switch (props.dialogSelector.toLowerCase()) {
      case 'deleteuserplan':
        return <DeleteUserPlanModal {...props} />
      case 'unsavedchanges':
        return <UnsavedChangesModal {...props} />
      case 'notification':
        return <NotificationModal {...props} />
      default:
        return null
    }
  }
}

export default Modal
