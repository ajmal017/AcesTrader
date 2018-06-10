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

  render() {
    return (
      <ManageProspects
        tradeSide={'Buys'}
        handleClick={this.handleClick}
        mockSymbols="'TQQQ','UDOW','UPRO','QLD','SPXL','MCHI','SSO','MTUM','XLK','QQQ','FXI','IWF','XLF','SPYG','DIA','EWJ','EWI','EWS','IVV','VOO','SPY','ACWI','VT','EWH','IEFA','SCHF','VEU','EFA','CWB','EZU','USMV','EFV'"
      />
    )
  }
}

export default ManageBuyProspects
