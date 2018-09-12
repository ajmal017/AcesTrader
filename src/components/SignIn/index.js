// SignIn/index.js

import React, { Component } from 'react'
// import { connect } from 'react-redux'
import SignInView from './SignInView'
import fire from '../../fire'
import { putReference, referenceRealtrader, referencePapertrader, referenceDebugtrader, referenceLocaltrader } from '../../lib/dbReference'

class SignInContainer extends Component {
  handleSignIn = async (event) => {
    event.preventDefault()
    const { email, password } = event.target.elements
    try {
      const user = await fire.auth().signInWithEmailAndPassword(email.value, password.value)
      // this.props.callback({ demoMode: false })
    } catch (error) {
      alert(error)
    }
  }
  handleSignUp = (event) => {
    event.preventDefault()
  }
  handleDemoMode = (event) => {
    event.preventDefault()
    putReference(referenceLocaltrader)

    this.props.history.push('/welcome') // reload current page
  }

  // this.props.callback({ demoMode: true })
  // // <Route path="/home" render={() => <div>Home</div>}/>
  // <Route render={() => <App/>}

  handleRealTrader = (event) => {
    putReference(referenceRealtrader)
  }
  handlePaperTrader = (event) => {
    putReference(referencePapertrader)
  }
  handleDebugTrader = (event) => {
    putReference(referenceDebugtrader)
  }

  render() {
    return (
      <SignInView
        onSubmit={this.handleSignIn}
        onSignUp={this.handleSignUp}
        onDemoMode={this.handleDemoMode}
        onRealTrader={this.handleRealTrader}
        onPaperTrader={this.handlePaperTrader}
        onDebugTrader={this.handleDebugTrader}
      />
    )
  }
}
// function mapStateToProps(state) {
// const props = {
//   exampleChartObject: state.files.exampleChartObject,
//   planName: state.files.planName,
//   planObject: state.files.planObject,
//   plansList: state.common.plansList,
//   dirty: state.files.dirty,
//   chartObject: state.charts.chartObject,
//   montecarloAllowed: state.charts.montecarloAllowed,
//   selectedTreeNode: state.plan.selectedTreeNode,
//   showCharts: state.plan.showCharts,
// }
// return props
// }

export default SignInContainer
// export default connect(mapStateToProps)(SignInContainer)
