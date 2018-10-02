// ChartsView/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getPeekPrices, resetPeekPrices } from '../../../lib/appLastPeekPrice'
import { updateDashboardPeekData } from '../../../redux'
import Chartcell from '../Chartcell'
import './styles.css'

class ChartsView extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
    // each time More/Peek is clicked, the peekPricesObject is created
    // the newly available prices are then used to update the dashboards,
    // after that the peekPricesObject is emptied, until the next Peek click
    let peekPricesObject = getPeekPrices()
    let peekPricesArray = Object.keys(peekPricesObject)
    if (peekPricesArray.length > 0) {
      this.props.dispatch(updateDashboardPeekData(peekPricesObject))
    }
    resetPeekPrices()
  }

  render() {
    // Create an array of Chartcells, one for each chart's graph & dashboard
    let cells = this.props.chartArray.map((obj, index) => {
      return <Chartcell key={index.toString()} handleClick={this.props.handleClick} cellObject={obj} />
    })
    // Depending on the initial parent each cell can be
    // a prospect Buy, a prospect ShortSale, a prospect TrendBuy,
    // a Long position, a Short position, or TrendLong position
    return (
      <div>
        <div id="charts-host" className="charts-host">
          {cells}
        </div>
        &nbsp;&nbsp;
        <a href="https://icons8.com">Pencil Icon by Icons8</a>
      </div>
    )
  }
}

// Depending in the initial parent this array can be
// can be a list of Buys, ShortSales TrendBuys, Longs, Shorts, or TrendLongs
ChartsView.propTypes = {
  chartArray: PropTypes.array.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(ChartsView)
