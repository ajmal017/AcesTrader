// ProspectSells/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class ProspectSells extends Component {
  render() {
    return <AppToolbar chartArray={this.props.sells} originList={'Short Sales'} />
  }
}

//Note to self: this triggers a render and passes new props to AppToolbar
function mapStateToProps(state) {
  const props = {
    sells: state.sells,
  }
  return props
}

export default connect(mapStateToProps)(ProspectSells)
