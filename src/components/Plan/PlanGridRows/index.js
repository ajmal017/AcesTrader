// PlanGridRows

import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

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

const PlanGridRows = (props) => {
  'use-strict'
  // var headerWrapperId = props.headerWrapperId;
  var columnClassNameAddOn = props.columnClassNameAddOn
  var wrapperId = props.wrapperId
  var theDataArray = props.dataArray
  var numberOfCols = theDataArray[0].length
  var theBaseClassName = 'plan-grid-row-cell' // base class
  var theStripeClassName = '' // initial value
  var theNowClassName = theBaseClassName // initial value
  var theGridClassName = 'plan-grid-row-layout ' + columnClassNameAddOn

  // We map all the table data values to sequencial grid cell values.
  // These are expected to fill up the grid columns left to right,
  // then wrapping to next row when no more columns. This should create
  // additional rows on demand, producing the final filled grid.
  // Note use of CSS property {grid-auto-flow: row}

  var merged = [].concat.apply([], theDataArray) //neat code pattern; see comment above

  var cells = merged.map((element, index) => {
    // Produce zebra stripes for grid rows
    if (index % numberOfCols === 0) {
      // start of new row
      theStripeClassName === theBaseClassName + ' plan-grid-row-nostripe'
        ? (theStripeClassName = theBaseClassName + ' plan-grid-row-stripe')
        : (theStripeClassName = theBaseClassName + ' plan-grid-row-nostripe')
    }
    // Format any value flagged by a prepended "#" character when data was collected
    if (element.indexOf('#') === 0) {
      element = element.slice(1)
      theNowClassName = theStripeClassName + ' plan-grid-row-cell-flag'
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

PlanGridRows.propTypes = {
  columnClassNameAddOn: PropTypes.string.isRequired,
  dataArray: PropTypes.array.isRequired,
  wrapperId: PropTypes.string.isRequired,
  headerWrapperId: PropTypes.string.isRequired,
  dataWrapperId: PropTypes.string.isRequired,
}
export default PlanGridRows
