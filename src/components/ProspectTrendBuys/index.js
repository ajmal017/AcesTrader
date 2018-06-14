// ProspectTrendBuys/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class ProspectTrendBuys extends Component {
  render() {
    return <AppToolbar chartArray={this.props.trendbuys} />
  }
}

function mapStateToProps(state) {
  const props = {
    trendbuys: state.trendbuys,
  }
  return props
}

export default connect(mapStateToProps)(ProspectTrendBuys)
