//TradesView/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TradeListing from '../TradeListing'
import './styles.css'

export default class TradesView extends Component {
  // constructor(props) {
  //     super(props);
  // }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    //Create the data for a bar chart to be shown along with the list of trades
    //let resultsDataBarChart = {} //TO DO

    // Create an array of TradeCells, one for each trade's graph & dashboard
    let cells = this.props.tradesArray.map((obj, index) => {
      return <TradeListing key={index.toString()} handleClick={this.props.handleClick} tradeObject={obj} />
    })

    // Each cell is a TradeList component with one trade object to render
    return (
      <div id="trades-host" className="trades-host">
        {cells}
      </div>
    )
  }
}

// This array is a list of trade results
TradesView.propTypes = {
  tradesArray: PropTypes.array.isRequired,
}
