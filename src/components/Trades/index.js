//Trades/index.js
// This is the container for the nested Trades components

import React from 'react'
import PropTypes from 'prop-types'
import TradesView from './TradesView'
// import './styles.css'

const Trades = (props) => {
  'use-strict'

  if (props.tradesArray.length > 0) {
    return (
      <div id={'chartscontianer'}>
        <TradesView handleClick={props.handleClick} tradesArray={props.tradesArray} />
      </div>
    )
  } else {
    return <h3 className="error"> There are no trades in this list</h3>
  }
}

Trades.propTypes = {
  tradesArray: PropTypes.array.isRequired,
}

export default Trades
