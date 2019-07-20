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
    // throw new Error('A test error has occured in ChartsView component!') // this only for testing Sentry
    window.scrollTo(0, 0)

    // Each time More/Peek is clicked, the peekPricesObject is created.
    // Then when Prospects , Positions or Trades is opened, the
    // newly available prices are then used to update dashboard and tally
    // data via a reducer action that is passed to all the state slices.
    // After that the peekPricesObject is emptied, until the next Peek click.

    // A simulated More/Peek click is done in WelcomeTrader.js, when the app's state is first loaded,
    // to get up-to-date prices for the getPeekPrices() call here when rendering the charts
    // -------------------------------------------------------
    // Also at this time the reducers will test the daily close price for past days
    // and compare to the trailingStopBasis price to see if an adjustment is needed.

    // Put the current peek prices into the current state
    const peekPricesObject = getPeekPrices() // get this object with cached prices to pass to dispatch
    this.props.dispatch(updateDashboardPeekData(peekPricesObject)) //reducers update each list object's changed peek price and trailingStopBasis
    resetPeekPrices()
  }

  render() {
    // Create an array of Chartcells, one for each chart's graph & dashboard
    let cells = this.props.chartArray.map((obj, index) => {
      return <Chartcell key={index.toString()} handleClick={this.props.handleClick} cellObject={obj} errorCount={index} />
    })
    // Depending on the initial parent, the cells array will be
    // Buy prospects, ShortSale prospects, TrendBuy prospects,
    // Long positions, Short positions, or TrendLong positions

    return (
      <div id='charts-host'>
        <main className={'charts-host'}>{cells}</main>
        <footer className={'footnote'}>
          <span>
            Copyright &copy; 2018-2019{' '}
            <a href={process.env.PUBLIC_URL + '/bm.html'} target='_blank' rel=' noopener noreferrer'>
              Bruce Martin
            </a>
          </span>
          <span>
            <a href='https://icons8.com'>Pencil Icon by Icons8</a>
          </span>
        </footer>
      </div>
    )
  }
}

// Depending in the initial parent this array can be
// a list of Buys, ShortSales TrendBuys, Longs, Shorts, or TrendLongs
ChartsView.propTypes = {
  chartArray: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
}

//Note: this used to get access to "this.props.dispatch", and for state access
//the new "props.cellObject" is created in a parent and passed down
const mapStateToProps = (state) => ({
  state: state,
})
export default connect(mapStateToProps)(ChartsView)
