//TradeListing/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TradeListing extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const tradeObject = this.props.tradeObject
    const exitDate = tradeObject.exitDate
    return <h4>Trade Exit {exitDate}</h4>
  }
}

TradeListing.propTypes = {
  tradeObject: PropTypes.object.isRequired,
}

export default TradeListing
