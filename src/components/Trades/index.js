//Trades/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class Trades extends Component {
  render() {
    return <AppToolbar resultsCharts={true} chartArray={this.props.results} originList={'Trades'} />
  }
}

//Note to self: this triggers a render and passes new props to AppToolbar
function mapStateToProps(state) {
  const props = {
    results: state.results,
  }
  return props
}

export default connect(mapStateToProps)(Trades)
