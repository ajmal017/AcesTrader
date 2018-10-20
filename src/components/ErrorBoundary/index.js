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
    this.setState({ error })
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
      //render fallback UI
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
    //when there's not an error, render children untouched
    return this.props.children
  }
}

export default ErrorBoundary
