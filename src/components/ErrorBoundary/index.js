// ErrorBoundary/index.js

import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'
import './styles.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
    this.active = false
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    if (this.props.sentry && this.active) {
      Sentry.configureScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key])
        })
      })
      Sentry.captureException(error)
      // Sentry.showReportDialog()
    }
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      if (this.props.chart) {
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
      } else {
        return (
          <div className="errorboundary-wrapper">
            <div className="errorboundary-content">
              <h2>Something went wrong.</h2>
              {/* <a onClick={() => Sentry.showReportDialog()}> Please click here to send feedback</a> */}
              <h4>You can reload the page and retry</h4>
            </div>
          </div>
        )
      }
    }
    //when there's not an error, render children untouched
    return this.props.children
  }
}

export default ErrorBoundary
