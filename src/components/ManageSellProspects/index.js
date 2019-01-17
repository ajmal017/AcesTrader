// ManageSellProspects/index.jsimport React, { Component } from 'react'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ManageProspects from '../ManageProspects'

class ManageSellProspects extends Component {
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
    return (
      <ManageProspects
        tradeSide={'Short Sales'}
        handleClick={this.handleClick}
        mockSymbols='EFA AGG BIV BND BNDX DRIP EWG EWW FAZ FEZ GDX GOVT HYG IEF JNK JNUG LQD MUB NUGT PFF SDOW SJNK SVXY TLT UGAZ VCSH XLP XLU'
      />
    )
  }
}
export default withRouter(ManageSellProspects)
