//ResetStorage/index.js

import { Component } from 'react'
import { connect } from 'react-redux'
import { resetState } from '../../lib/localStorage'
import { resetCache } from '../../lib/chartDataCache'
import { resetAppState } from '../../redux/index.js'
import { queryresetlocalstorage } from '../../redux/reducerModal'

class ResetStorage extends Component {
  constructor(props) {
    super(props)
    this.handleResetQueryResonse = this.handleResetQueryResonse.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(queryresetlocalstorage(this.handleResetQueryResonse))
  }

  handleResetQueryResonse(response) {
    let buttonFlag = response.buttonFlag
    if (buttonFlag === 'yes') {
      this.props.dispatch(resetAppState()) //handled by each reducer
      // resetState() // erase local storage
      // resetCache() // clear all previously cached chart price data for fresh start
      // } else {
      //   if (this.props.history.length > 0) {
      //     this.props.history.goBack()
      //   }
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

// export default ResetStorage
export default connect(mapStateToProps)(ResetStorage)
