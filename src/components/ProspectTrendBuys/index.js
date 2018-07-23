// ProspectTrendBuys/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class ProspectTrendBuys extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <AppToolbar chartArray={this.props.trendbuys} />
  }
}

//Note to self: this triggers a render
function mapStateToProps(state) {
  const props = {
    trendbuys: state.trendbuys,
  }
  return props
}

export default connect(mapStateToProps)(ProspectTrendBuys)
