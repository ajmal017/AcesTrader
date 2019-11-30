// AddPseudoBar/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { buildPseudoBar } from '../../lib/appBuildPseudobar.js'
import WelcomeTrader from '../Welcome/WelcomeTrader'

class AddPseudoBar extends Component {
  constructor(props) {
    super(props)
    this.errorMessage = null
    this.state = { loading: true, error: false }
  }

  handleClick = (event) => {
    event.preventDefault()
    this.setState({ loading: false, error: null }) // exit
  }

  componentDidMount() {
    buildPseudoBar(this.props.state, this.props.dispatch).then(
      (errorMessage) => {
        // note that if buildPseudoBar is successful, errorMessage is null so loading=false allows render of WelcomeTrader
        this.setState({ loading: false, error: errorMessage })
      },
      (error) => {
        alert(`error in AddPseudobar: ${error}`)
        debugger
      }
    )
  }
  render() {
    const { loading, error } = this.state
    const divStyle = { marginTop: 80, marginLeft: 50 }
    if (loading) {
      return (
        <div style={divStyle}>
          <h4>{'Working, please wait...'}</h4>
        </div>
      )
    }
    if (error) {
      return (
        <div style={divStyle}>
          <h4>{`${error}`}</h4>
          <p>
            <button onClick={this.handleClick}> OK </button>
          </p>
        </div>
      )
    }
    return <WelcomeTrader /> // e
  }
}

const mapStateToProps = (state) => ({
  state: state,
})
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
})

//Note: this used to get access to state and dispatch
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPseudoBar)

//     let errorMessage
//     buildPseudoBar(this.props.state, this.props.dispatch).then(function(errorMsg) {
//       debugger
//       if (errorMsg) {
//         errorMessage = errorMsg
//       } else {
//         return <WelcomeTrader /> // exit to welcome screen
//       }
//     })
//     return (
//       <div style={{ marginTop: 80, marginLeft: 50 }}>
//         <h4>{`${errorMessage}`}</h4>
//         <p>
//           <button onClick={this.handleClick}> OK </button>
//         </p>
//       </div>
//     )
//   }
