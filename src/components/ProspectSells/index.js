// ProspectSells/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class ProspectSells extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <AppToolbar chartArray={this.props.sells} />
  }
}

//Note to self: this triggers a render
function mapStateToProps(state) {
  const props = {
    sells: state.sells,
  }
  return props
}

export default connect(mapStateToProps)(ProspectSells)
