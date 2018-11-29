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
  }

  render() {
    //Create the data for a bar chart to be shown along with the list of trades
    //let resultsDataBarChart = {} //TO DO

    // Create an array of TradeCells, one for each trade's dashboard
    let cells = this.props.tradesArray.map((obj, index) => {
      return <TradeCell key={index.toString()} handleClick={this.props.handleClick} tradeObject={obj} />
    })

    // Each cell is a TradeList component with one trade object to render
    return (
      <>
        <main id='trades-host' className='trades-host'>
          {cells}
        </main>

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
      </>
    )
  }
}

// This array is a list of trade results
TradesView.propTypes = {
  tradesArray: PropTypes.array.isRequired,
}
