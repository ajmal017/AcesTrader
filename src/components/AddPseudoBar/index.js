// AddPseudoBar/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BuildPseudoBar } from '../../components/BuildPseudoBar'

class AddPseudoBar extends Component {
  render() {
    const state = this.props.state
    const dispatch = this.props.dispatch
    return <BuildPseudoBar state={state} dispatch={dispatch} />
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
