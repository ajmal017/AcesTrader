// ProspectBuys/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class ProspectBuys extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <AppToolbar chartArray={this.props.buys} />
  }
}

//Note to self: this triggers a render
function mapStateToProps(state) {
  const props = {
    buys: state.buys,
  }
  return props
}

export default connect(mapStateToProps)(ProspectBuys)
