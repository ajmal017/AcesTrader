// ProspectBuys/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class ProspectBuys extends Component {
  render() {
    return <AppToolbar chartArray={this.props.buys} />
  }
}

//Note to self: this triggers a render and passes new props to AppToolbar
function mapStateToProps(state) {
  const props = {
    buys: state.buys,
  }
  return props
}

export default connect(mapStateToProps)(ProspectBuys)
