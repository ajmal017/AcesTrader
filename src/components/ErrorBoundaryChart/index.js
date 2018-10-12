// ErrorBoundaryChart/index.js

// Experimental - Special ErrorBoundary component to ignore error from within CandleStickChartWithMA

import React, { Component } from 'react'

class ErrorBoundaryChart extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    // alert('An error happened in the charting program\nbut we are not interrupting the program.\nYou may refresh the page to get a fresh start.')

    // // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <p>Please take screen shot and email to support@martinapps.com</p>
          <p>You can click the back arrow for a fresh start.</p>
          {/* <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details> */}
        </div>
      )
    }
    // never abort, always continue regardless of the error
    return this.props.children
  }
}
export default ErrorBoundaryChart
