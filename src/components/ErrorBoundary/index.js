// ErrorBoundary/index.js

import React, { Component } from 'react'
import './styles.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  // // This forces the display for testing the css layout
  // componentDidMount() {
  //   const error = 'An error has occured in Chartcell component!'
  //   const errorInfo = {
  //     componentStack:
  //       'in Chartcell (created by Connect(Chartcell)) in Connect(Chartcell) (at index.js:28) in div (at index.js:35) in div (at index.js:34) in ChartsView (created by Connect(ChartsView)) in Connect(ChartsView) (at index.js:17) in div (at index.js:16) in Charts (created by Connect(Charts)) in Connect(Charts) (at index.js:96) in div (at index.js:86) in AppToolbar (created by withSizes(AppToolbar)) in withSizes(AppToolbar) (at index.js:8) in ProspectBuys (created by Connect(ProspectBuys)) in Connect(ProspectBuys) (at PrivateRoute.js:7) in Route (at PrivateRoute.js:7) in PrivateRoute (at index.js:48) in Switch (at index.js:42) in div (at index.js:40) in Router (created by BrowserRouter) in BrowserRouter (at index.js:39) in div (at index.js:37) in Provider (at index.js:36) in Root (at index.js:84) in ErrorBoundary (at index.js:83) in App (at index.js:35)',
  //   }
  //   this.setState({
  //     error: error,
  //     errorInfo: errorInfo,
  //   })
  // }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
    // this.setState({ hasError: true })
    // console.log(`Error ${error}
    //     Info ${info}`)
    // // alert error to iPad screen
    // alert(`Error ${error}
    //     Info ${info}
    //     Please take screen shot and email to support@martinapps.com`)
    // // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }
  // style={{ whiteSpace: 'pre-wrap' }}
  render() {
    if (this.state.errorInfo) {
      return (
        <div className={'errorboundary-wrapper'}>
          <div className={'errorboundary-content'}>
            <h2>Something went wrong.</h2>
            <h5>Please take a screen shot and email to support@martinapps.com</h5>
            <h4>{this.state.error && this.state.error.toString()}</h4>
            <p>{this.state.errorInfo.componentStack}</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary
