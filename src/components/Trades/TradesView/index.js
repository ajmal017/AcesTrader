//TradesView/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { GridHeader, GridRows } from '../GridContent'
// import TradeListing from '../TradeListing'
import './styles.css'

export default class TradesView extends Component {
  // constructor(props) {
  //     super(props);
  // }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    const gridId = 'tradesviewgrid'
    const headerWrapperId = gridId + '-header-wrapper'
    const dataWrapperId = gridId + '-data-wrapper'

    //Create the data for a bar chart to be shown along with the list of trades
    //let resultsDataBarChart = {} //TO DO

    //Create the array of column names
    // let columnDefs = ['Symbol', 'Watched', 'Entered', 'Enter Price', 'Exit Price', 'Quantity', '% Gain', '$ Gain'] // an array of column names
    let columnDefs = ['Symbol', 'Dates', 'Prices', 'Quantity', '% Gain', '$ Gain'] // an array of column names
    let columnClassNameAddOn = `grid-layout-${columnDefs.length}cols` // class name determining column layout

    // Create an array of row data arrays
    let rowDefsArray = this.props.tradesArray.map((tradeObject, index) => {
      let symbol = tradeObject.symbol
      let watchDate = tradeObject.watched
      let enterDate = tradeObject.entered
      let enterPrice = tradeObject.enteredPrice
      let exitDate = tradeObject.exited
      let exitPrice = tradeObject.exitedPrice
      let tradeQuantity = tradeObject.quantity
      let tradePercentGain = exitPrice !== 'pending' ? (100 * (exitPrice - enterPrice)) / enterPrice + '%' : 'pending'
      let tradeDollarGain = exitPrice !== 'pending' ? tradeQuantity * (exitPrice - enterPrice) : 'pending'
      let tradeSide = tradeObject.dashboard.tradeSide
      // let tradeHeader = `${symbol} - A ${tradeSide} Trade`

      let cell0 = `${symbol}\nA ${tradeSide} Trade`
      let cell1 = `Watch ${watchDate}\n Enter ${enterDate}\n  Exit ${exitDate}`
      let cell2 = `Enter ${enterPrice}\n Exit ${exitPrice}`
      let cell3 = `${tradeQuantity}`
      let cell4 = `${tradePercentGain}`
      let cell5 = `${tradeDollarGain}`
      let rowData = [cell0, cell1, cell2, cell3, cell4, cell5]
      return rowData

      // return <TradeListing key={index.toString()} handleClick={this.props.handleClick} tradeObject={obj} />
    })
    // debugger

    // Each cell is a TradeList component with one trade object to render
    return (
      <div id={gridId} className={'grid-wrapper'}>
        <div id={headerWrapperId} className={'grid-header-wrapper'}>
          <GridHeader wrapperId={gridId} dataArray={columnDefs} columnClassNameAddOn={columnClassNameAddOn} />
        </div>
        <div id={dataWrapperId} className={'grid-data-wrapper'}>
          <GridRows wrapperId={gridId} dataArray={rowDefsArray} columnClassNameAddOn={columnClassNameAddOn} headerWrapperId={headerWrapperId} dataWrapperId={dataWrapperId} />
        </div>
      </div>
    )
  }
}

// This array is a list of trade results
TradesView.propTypes = {
  tradesArray: PropTypes.array.isRequired,
}
