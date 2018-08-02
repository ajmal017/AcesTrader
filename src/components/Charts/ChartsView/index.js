// ChartsView/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Chartcell from '../Chartcell'
import './styles.css'

export default class ChartsView extends Component {
  // constructor(props) {
  //     super(props);
  // }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    // Create an array of Chartcells, one for each chart's graph & dashboard
    let cells = this.props.chartArray.map((obj, index) => {
      return <Chartcell key={index.toString()} handleClick={this.props.handleClick} cellObject={obj} />
    })

    // Depending in the initial parent each cell can be
    // a Result,
    // a prospect Buy, a prospect Sell, a prospect TrendBuy,
    //a Long position, a Short position, or TrendLong position
    return (
      <div id="charts-host" className="charts-host">
        {cells}
      </div>
    )
  }
}

// Depending in the initial parent this array can be
// can be a list of Buys, Sells, Longs, or Shorts
ChartsView.propTypes = {
  chartArray: PropTypes.array.isRequired,
}
