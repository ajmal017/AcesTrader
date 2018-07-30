// Results/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class Results extends Component {
  render() {
    return <AppToolbar chartArray={this.props.results} />
  }
}

//Note to self: this triggers a render and passes new props to AppToolbar
function mapStateToProps(state) {
  const props = {
    results: state.results,
  }
  return props
}

export default connect(mapStateToProps)(Results)
