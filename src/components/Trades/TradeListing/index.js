//TradeListing/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TradeListing extends Component {
  render() {
    const tradeObject = this.props.tradeObject
    const symbol = tradeObject.symbol
    const watchDate = tradeObject.watched
    const enterDate = tradeObject.entered
    const enterPrice = tradeObject.enteredPrice
    const exitDate = tradeObject.exited
    const exitPrice = tradeObject.exitedPrice
    const tradeGain = exitPrice !== 'pending' ? (100 * (exitPrice - enterPrice)) / enterPrice + '%' : 'pending'
    const tradeSide = tradeObject.dashboard.tradeSide
    const tradeHeader = `${symbol} - A ${tradeSide} Trade`
    // switch (tradeSide) {
    //   case 'Swing Longs': {
    //     // debugger
    //     break
    //   }
    //   default:
    //     alert('ERROR3 Missing tradeSide in TradeListing')
    // }

    return (
      <div>
        <h4>{tradeHeader}</h4>
        <p>
          Watched {watchDate}, Entered {enterDate}, Exited {exitDate}
        </p>
        <p>
          Entered Price {enterPrice}, Exit Price {exitPrice}, Gain {tradeGain}
        </p>
      </div>
    )
  }
}

TradeListing.propTypes = {
  tradeObject: PropTypes.object.isRequired,
}

export default TradeListing
