import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    alert(`Please take screen shot and email to support@martinapps.com
    this.state.error.toString()
    this.state.errorInfo.componentStack`)

    // if (typeof info === 'object') {
    //   const myJSON = JSON.stringify(info)
    //   console.log(`Error ${error}
    //   Info ${myJSON}`)
    //   alert(`Please take screen shot and email to support@martinapps.com
    //   Error ${error}
    //   Info ${myJSON}`)
    // } else {
    //   alert(`Please take screen shot and email to support@martinapps.com
    //   this.state.error.toString()
    //   this.state.errorInfo.componentStack`)
    // }

    // // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary
