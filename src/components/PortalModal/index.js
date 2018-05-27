// PortalModal/index.js

// Portal framework from: https://www.nearform.com/blog/exploring-react-portals/

import React from 'react'
import { connect } from 'react-redux'
import { Portal } from 'react-portal'
import Modal from '../Modal'

class PortalModal extends React.Component {
  render() {
    return (
      <Portal>
        <Modal {...this.props} />
      </Portal>
    )
  }
}

// Modal dialog displays are triggered by redux actions
// that change the state.modal object model

// Modal will call functions that are follow-ups to the modal
// dialog response in certain cases, e,g,: Delete

// We use mapStateToProps to get props to pass on to Modal
function mapStateToProps(state) {
  const props = state.modal
  return props ? props : {}
}

export default connect(mapStateToProps)(PortalModal)
