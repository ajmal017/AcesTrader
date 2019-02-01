//TradesView/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TradesChart from '../TradesChart'
import TradeCell from '../TradeCell'
import './styles.css'

export default class TradesView extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    if (this.props.tradesArray.length === 0) {
      return <h3 className='error'> There are no entries in the {this.props.originList} list</h3>
    }

    //Create the data for a bar chart to be shown along with the list of trades
    //let resultsDataBarChart = {} // TO DO

    // Create an array of TradeCells, one for each trade's dashboard
    let cells = this.props.tradesArray.map((obj, index) => {
      return <TradeCell key={index.toString()} handleClick={this.props.handleClick} tradeObject={obj} />
    })

    // Each cell is a TradeList component with one trade list object to render
    return (
      <>
        <div id='tradescontainer'>
          <div id='tradeschart'>
            <TradesChart />
          </div>
          <div id='trades-host' className='trades-host'>
            {cells}
          </div>
        </div>

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
      </>
    )
  }
}

// This array is a list of trade results
TradesView.propTypes = {
  tradesArray: PropTypes.array.isRequired,
  originList: PropTypes.string.isRequired,
}
