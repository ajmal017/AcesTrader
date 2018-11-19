// ErrorBoundary/index.js

import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'
import './styles.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    if (process.env.NODE_ENV === 'production') {
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
              <h3>Oops- Something went wrong drawing your chart.</h3>
              {/* <a onClick={() => Sentry.showReportDialog()}> Please click here to send feedback</a> */}
              <h4>Click the back arrow,</h4>
              <h4>or refresh the page to retry.</h4>
            </div>
          </div>
        )
      } else {
        return (
          <div className="errorboundary-wrapper">
            <div className="errorboundary-content">
              <h3>Oops- Something went wrong.</h3>
              {/* <a onClick={() => Sentry.showReportDialog()}> Please click here to send feedback</a> */}
              <h4>Please refresh the page to retry</h4>
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
