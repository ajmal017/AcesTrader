// Results/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppToolbar from '../../components/AppToolbar'

class Results extends Component {
  // componentDidUpdate(prevProps) {
  //   if (this.props.results !== prevProps.results) {
  //     // start the fade-out, fade-in transition now before the browser updates the screen
  //   }
  // }

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

export default connect(mapStateToProps)(Results)
