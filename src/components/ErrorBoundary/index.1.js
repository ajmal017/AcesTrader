import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
    if (typeof info === 'object') {
      const myJSON = JSON.stringify(info)
      console.log(`Error ${error} 
      Info ${myJSON}`)
      alert(`Please take screen shot and email to support@martinapps.com
      Error ${error} 
      Info ${myJSON}`)
    } else {
      console.log(`Error ${error} 
        Info ${info}`)
      alert(`Please take screen shot and email to support@martinapps.com
        Error ${error} 
        Info ${info}`)
    }
    // // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Uh oh! Something went wrong.</h1>
    }
    return this.props.children
  }
}
export default ErrorBoundary
