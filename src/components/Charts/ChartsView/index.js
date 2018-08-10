// ChartsView/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
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
    let cells = this.props.chartArray.map((obj, index) => (
      <CSSTransition key={index} classNames="example" timeout={{ enter: 500, exit: 300 }}>
        <Chartcell key={index.toString()} handleClick={this.props.handleClick} cellObject={obj} />
      </CSSTransition>
    ))

    // Depending in the initial parent each cell can be
    // a prospect Buy, a prospect ShortSale, a prospect TrendBuy,
    // a Long position, a Short position, or TrendLong position
    return (
      <div id="charts-host" className="charts-host">
        <TransitionGroup>{cells}</TransitionGroup>
      </div>
    )
  }
}

// Depending in the initial parent this array can be
// can be a list of Buys, ShortSales TrendBuys, Longs, Shorts, or TrendLongs
ChartsView.propTypes = {
  chartArray: PropTypes.array.isRequired,
}
