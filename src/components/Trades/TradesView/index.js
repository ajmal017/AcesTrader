//TradesView/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TradeCell from '../TradeCell'
import './styles.css'

export default class TradesView extends Component {
  // constructor(props) {
  //     super(props);
  // }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.resultsData = {} //TO DO
  }

  render() {
    // Create an array of TradeCells, one for each trade's graph & dashboard
    let cells = this.props.tradesArray.map((obj, index) => {
      return <TradeCell key={index.toString()} handleClick={this.props.handleClick} cellObject={obj} resultsData={this.resultsData} />
    })

    // Each cell is a trade Result
    return (
      <div id="trades-host" className="trades-host">
        {cells}
      </div>
    )
  }
}

// This array is a list of trade results
TradesView.propTypes = {
  chartArray: PropTypes.array.isRequired,
}
