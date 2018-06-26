// ManageBuyProspects/index.js

import React, { Component } from 'react'
import ManageProspects from '../ManageProspects'

class ManageBuyProspects extends Component {
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

  // "'TQQQ','UDOW','UPRO','QLD','SPXL','MCHI','SSO','MTUM','XLK','QQQ','FXI','IWF','XLF','SPYG','DIA','EWJ','EWI','EWS','IVV','VOO','SPY','ACWI','VT','EWH','IEFA','SCHF','VEU','EFA','CWB','EZU','USMV','EFV'",
  // 'UWT, UCO, TNA, FAS, GUSH, ERX, USO, MCHI, XME, XOP, KRE, IJR, FXI, KBE, XLF, DIA, IWM, PDBC, EWJ, XLE, ACWI, EWH, EWQ, VTV, EWY, SCHF, IEFA, VEU, VEA, EFA, EZU, VGK, EWU, HEZU, OIH, TBT ',
  // Note: For testing and demonstration a list of ETF ssymbols
  //is passed to ManageProspects to use as default input to the prospects list
  render() {
    return (
      <ManageProspects
        tradeSide={'Swing Buys'}
        handleClick={this.handleClick}
        mockSymbols="ACWI DBC DIA EFA ERX EWH EWJ FAS GUSH IEFA IJH KBE KRE MCHI MDY OIH TBT VEA VFH VT VTV XLE XLF XLI XOP XRT"
      />
    )
  }
}

export default ManageBuyProspects
