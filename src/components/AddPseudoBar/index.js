// AddPseudoBar/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BuildPseudoBar } from '../../components/BuildPseudoBar'

class AddPseudoBar extends Component {
  render() {
    return <BuildPseudoBar state={(this.props.state, this.props.dispatch)} />
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
