// ManageTrendFollowerProspects/index.js

import React, { Component } from 'react'
import ManageProspects from '../ManageProspects'

class ManageTrendFollowerProspects extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  // handle callbacks from child components
  handleClick(flag, target) {
    if (flag === 'push') {
      this.props.history.push(target)
    }
  }

  // Note: For testing and demonstration a list of ETF ssymbols
  //is passed to ManageProspects to use as default input to the prospects list
  render() {
    return <ManageProspects tradeSide={'Trend Followers'} handleClick={this.handleClick} mockSymbols="IDV VNQI VEU VWO VTI VEA" />
  }
}

export default ManageTrendFollowerProspects
