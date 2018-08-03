//TradeListing/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TradeListing extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const tradeObject = this.props.tradeObject
    const symbol = tradeObject.symbol
    const exitDate = tradeObject.exited
    const exitPrice = tradeObject.exitedPrice

    return (
      <div>
        <h4>Trade Symbol {symbol}</h4>
        <h4>Trade Exited {exitDate}</h4>
        <h4>Trade Exit Price {exitPrice}</h4>
      </div>
    )
  }
}

TradeListing.propTypes = {
  tradeObject: PropTypes.object.isRequired,
}

export default TradeListing
