// ErrorBoundaryChart/index.js

// Experimental - Special ErrorBoundary component to ignore error from within CandleStickChartWithMA

import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'
import './styles.css'

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
    Sentry.configureScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })
    })
    Sentry.captureException(error)
    // Sentry.showReportDialog()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="errorboundary-wrapper">
          <div className="errorboundary-content">
            <h2>Something went wrong drawing your chart.</h2>
            {/* <a onClick={() => Sentry.showReportDialog()}> Please click here to send feedback</a> */}
            <h4>Click the back arrow for a retry.</h4>
            <h4>Or refresh the page to restart.</h4>
          </div>
        </div>
      )
    }
    //when there's not an error, render children untouched
    return this.props.children
  }
}

export default ErrorBoundaryChart
