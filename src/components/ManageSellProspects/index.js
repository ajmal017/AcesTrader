// ManageSellProspects/index.jsimport React, { Component } from 'react'

import React, { Component } from 'react'
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
        tradeSide={'Sells'}
        handleClick={this.handleClick}
        mockSymbols="AGG BND DRIP DWT EIDO EMB EMLC EWW FAZ GDX HYG IBB IEF INDA ITB IYR JNK JNUG LQD NUGT PCY PFF PGX SCO SDOW SHY SJNK SLV SVXY TLT TZA UGAZ UNG USLV VCSH VNQ XLP XLRE XLU"
      />
    )
  }
}

export default ManageSellProspects
