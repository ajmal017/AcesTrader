// ManageTrendBuyProspects/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ManageProspects from '../ManageProspects'

class ManageTrendBuyProspects extends Component {
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
    return <ManageProspects tradeSide={'Trend Buys'} handleClick={this.handleClick} mockSymbols='DEM DES IDV SHV VB VEU VIG VNQ VNQI VSS VTI VWO VEA VT VTV' />
  }
}
export default withRouter(ManageTrendBuyProspects)
