// ManageBuyProspects/index.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
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
  // "TRTY hyd amzn msft alfa ACWI DBC DIA EFA ERX EWH EWJ FAS GUSH IEFA IJH KBE KRE MCHI MDY OIH TBT VEA VFH VT VTV XLE XLF XLI XOP XRT"
  // Note: For testing and debugging a list of ETF ssymbols is passed to ManageProspects to use as default input to the prospects list
  render() {
    return <ManageProspects tradeSide={'Buys'} handleClick={this.handleClick} mockSymbols='shv hyd amzn msft alfa vb vt vti vtv trty' />
  }
}
export default withRouter(ManageBuyProspects)
