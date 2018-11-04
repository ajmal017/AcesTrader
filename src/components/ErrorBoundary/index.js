// ErrorBoundary/index.js

import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'
import './styles.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
    //***** False in development, True for production *****
    this.active = false
    if (process.env.NODE_ENV === 'production') {
      this.active = true
    }
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
      debugger
    }
  }

  render() {
    if (this.state.error) {
      debugger
      //render fallback UI
      if (this.props.chart) {
        return (
          <div className="errorboundary-wrapper">
            <div className="errorboundary-content">
              <h3>Something went wrong drawing your chart.</h3>
              {/* <a onClick={() => Sentry.showReportDialog()}> Please click here to send feedback</a> */}
              <h4>Click the back arrow to retry.</h4>
              <h4>Or refresh the page to restart.</h4>
            </div>
          </div>
        )
      } else {
        return (
          <div className="errorboundary-wrapper">
            <div className="errorboundary-content">
              <h3>Something went wrong.</h3>
              {/* <a onClick={() => Sentry.showReportDialog()}> Please click here to send feedback</a> */}
              <h4>You can refresh the page to retry</h4>
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
