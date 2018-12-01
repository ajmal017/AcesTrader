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
    // throw new Error('An error has occured in Buggy ChartsView component!') // for testing Sentry
    window.scrollTo(0, 0)
    // Each time More/Peek is clicked, the peekPricesObject is created.
    // Then when Prospects , Positions or Trades is opened, the
    // newly available prices are then used to update dashboard and tally
    // data via a reducer action that is passed to all the state slices.
    // After that the peekPricesObject is emptied, until the next Peek click.
    let peekPricesObject = getPeekPrices()
    let peekPricesArray = Object.keys(peekPricesObject)
    if (peekPricesArray.length > 0) {
      this.props.dispatch(updateDashboardPeekData(peekPricesObject)) //reducers update each list object
    }
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
        <main className='charts-host'>{cells}</main>
        <footer className={'footnote'}>
          <span>
            Copyright &copy; 2018{' '}
            <a href={process.env.PUBLIC_URL + '/bm.html'} target='_blank' rel=' noopener noreferrer'>
              Bruce Martin
            </a>
          </span>
          <span>
            <a href='https://icons8.com'>Pencil Icon by Icons8</a>
          </span>
        </footer>

        {/* this hack is to provide sufficient space so the <dialog> model window is not cropped */}
        {cells.length < 2 ? <div style={{ height: 600, backgroundColor: '#bac8ff' }}> </div> : ''}
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
