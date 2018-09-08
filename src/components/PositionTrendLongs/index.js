// PositionTrendLongs/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class PositionTrendLongs extends Component {
  render() {
    return <AppToolbar chartArray={this.props.trendlongs} originList={'Trend Longs'} />
  }
}

//Note to self: this triggers a render and passes new props to AppToolbar
function mapStateToProps(state) {
  const props = {
    trendlongs: state.trendlongs,
  }
  return props
}

export default connect(mapStateToProps)(PositionTrendLongs)
