// PositionLongs/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class PositionLongs extends Component {
  render() {
    return <AppToolbar chartArray={this.props.longs} originList={'Longs'} />
  }
}

//Note to self: this triggers a render and passes new props to AppToolbar
function mapStateToProps(state) {
  const props = {
    longs: state.longs,
  }
  return props
}

export default connect(mapStateToProps)(PositionLongs)
