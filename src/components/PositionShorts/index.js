// PositionShorts/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class PositionShorts extends Component {
  render() {
    return <AppToolbar chartArray={this.props.shorts} />
  }
}

//Note to self: this triggers a render and passes new props to AppToolbar
function mapStateToProps(state) {
  const props = {
    shorts: state.shorts,
  }
  return props
}

export default connect(mapStateToProps)(PositionShorts)
