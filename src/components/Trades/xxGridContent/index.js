// GridContent

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import appScrollbarWidth from '../../../lib/appScrollbarWidth'
import './styles.css'

const GridHeader = (props) => {
  'use-strict'
  var theDataArray = props.dataArray //holds the column names
  if (theDataArray.length === 0) {
    return null //no header supplied
  }
  var columnClassNameAddOn = props.columnClassNameAddOn
  var wrapperId = props.wrapperId
  var theGridClassName = 'grid-header-layout ' + columnClassNameAddOn
  var headers = theDataArray.map((element, index) => {
    //map the column names to header labels
    return (
      <div key={index} className={'grid-header-cell'}>
        <span className={'grid-header-item'}>{element}</span>
      </div>
    )
  })
  return (
    <div id={wrapperId + 'header'} className={theGridClassName}>
      {headers}
    </div>
  )
}

// *****This code solves the problem in using an array of arrays of results for the data grid****
// http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
// Subject: Merge/flatten an array of arrays in JavaScript?
// Q: I have a JavaScript array like:
// [["$6"], ["$12"], ["$25"], ["$25"], ["$18"], ["$22"], ["$10"]]
// How would I go about making this just:
// ["$6", "$12", "$25", ...]
// A: You can use concat to merge arrays:
// var arrays = [["$6"], ["$12"], ["$25"], ["$25"], ["$18"], ["$22"], ["$10"]];
// var merged = [].concat.apply([], arrays);
// Using the apply method of concat will just take the second parameter as an array, so the last line is identical to this:
// var merged2 = [].concat(["$6"], ["$12"], ["$25"], ["$25"], ["$18"], ["$22"], ["$10"]);

class GridRows extends Component {
  constructor(props) {
    super(props)
    this.headerWrapperId = props.headerWrapperId
  }

  // Map all the table data values to sequencial grid cell values.
  // These are expected to fill up the grid columns left to right,
  // then wrapping to next row when no more columns. This should create
  // additional rows on demand, producing the final filled grid.
  // Note use of CSS property {grid-auto-flow: row}

  componentDidMount = () => {
    let scrollbarWidth = appScrollbarWidth()
    let headerWrapper = document.getElementById(this.headerWrapperId)
    headerWrapper.style.right = scrollbarWidth + 'px' /*absolute position the right side away from the scrollbar*/
    document.body.setAttribute('style', 'padding-left:' + scrollbarWidth * 0.8 + 'px;') /*add an equal left padding to the body*/
  }

  render() {
    let columnClassNameAddOn = this.props.columnClassNameAddOn
    let wrapperId = this.props.wrapperId
    // let dataWrapperId = this.props.dataWrapperId;
    let theDataArray = this.props.dataArray
    let numberOfCols = theDataArray[0].length

    var theBaseClassName = 'grid-row-cell' // base class
    var theStripeClassName = '' // initial value
    var theNowClassName = theBaseClassName // initial value
    var theGridClassName = 'grid-row-layout ' + columnClassNameAddOn //two classe names

    // This creates an array with an item for each cell in the grid
    // Cells are then filled serially and items wrap into next row
    var merged = [].concat.apply([], theDataArray) //neat code pattern; see comment above

    var cells = merged.map((element, index) => {
      // Produce zebra stripes for grid rows
      if (index % numberOfCols === 0) {
        // start of new row
        theStripeClassName === theBaseClassName + ' grid-row-nostripe'
          ? (theStripeClassName = theBaseClassName + ' grid-row-stripe')
          : (theStripeClassName = theBaseClassName + ' grid-row-nostripe')
      }

      // This is only temporary to demonstrate the technique to be used on the PlanDataGrid
      // Format any value flagged by a prepended "#" character when data was collected
      if (element.indexOf('#') === 0) {
        element = element.slice(1)
        theNowClassName = theStripeClassName + ' grid-row-cell-flag'
      } else {
        theNowClassName = theStripeClassName
      }

      return (
        <div key={index} className={theNowClassName}>
          {element}
        </div>
      )
    })

    return (
      <div id={wrapperId + 'rows'} className={theGridClassName}>
        {cells}
      </div>
    )
  }
}

GridHeader.propTypes = {
  columnClassNameAddOn: PropTypes.string.isRequired,
  dataArray: PropTypes.array.isRequired,
  wrapperId: PropTypes.string.isRequired,
}
GridRows.propTypes = {
  columnClassNameAddOn: PropTypes.string.isRequired,
  dataArray: PropTypes.array.isRequired,
  wrapperId: PropTypes.string.isRequired,
  headerWrapperId: PropTypes.string.isRequired,
  // dataWrapperId: PropTypes.string.isRequired
}

export { GridHeader, GridRows }
