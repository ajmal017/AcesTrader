//EraseLists/index.js

import { Component } from 'react'
import { connect } from 'react-redux'
import { resetAppState } from '../../redux/index.js'
import { queryeraselists } from '../../redux/reducerModal'

class EraseLists extends Component {
  constructor(props) {
    super(props)
    this.handleResetQueryResonse = this.handleResetQueryResonse.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(queryeraselists(this.handleResetQueryResonse))
  }

  handleResetQueryResonse(response) {
    let buttonFlag = response.buttonFlag
    if (buttonFlag === 'yes') {
      this.props.dispatch(resetAppState()) //handled by each reducer
    }
    if (this.props.history.length > 0) {
      this.props.history.goBack()
    }
  }

  render() {
    return null
  }
}

//Note to self: this provides access to redux's dispatch()
const mapStateToProps = (state) => ({
  state: state,
})

// export default EraseLists
export default connect(mapStateToProps)(EraseLists)
