// GridContainer

import React from 'react'
import PropTypes from 'prop-types'
import { GridHeader, GridRows } from '../GridContent'
import './styles.css'

const GridContainer = (props) => {
  'use-strict'
  const getHeaderClass = (theColumnArray) => {
    if (theColumnArray.length === 3) {
      return 'grid-layout-3cols'
    } else if (theColumnArray.length === 4) {
      return 'grid-layout-4cols'
    } else if (theColumnArray.length === 6) {
      return 'grid-layout-6cols'
    } else if (theColumnArray.length === 8) {
      return 'grid-layout-8cols'
    }
  }

  const tab_key = props.tab_key
  const gridId = props.chart_name.replace(/[\W_]/g, '') + 'grid' + tab_key
  const headerWrapperId = gridId + '-header-wrapper'
  const dataWrapperId = gridId + '-data-wrapper'
  const chartdata_array = props.data_object[props.chart_name].chartdata
  const journaldata_array = props.data_object[props.chart_name].journaldata

  let columnDefs = [] // an array of column names
  let rowDefsArray = [] // an array of rowDefs[]
  let theDataArray = []
  let columnClassNameAddOn = '' // class name determining column widths

  if (tab_key === 1) {
    // This builds the grid's data for the chart's yearly cash flow data
    theDataArray = chartdata_array.slice() //returns a shallow copy
  } else if (tab_key === 2) {
    // This builds the grid's data for the chart's journal data
    theDataArray = journaldata_array.slice() //returns a shallow copy
  }
  // let keyList = []; // an array of key values, one for each column
  // keyList = theDataArray[0].map((element, index) => { //map the 1st row of column names to create array of key values
  //     return (element.replace(/[\W_]/g, '')) //remove all non-alphanumeric characters
  // });
  columnDefs = theDataArray[0].map((element, index) => {
    //map the 1st row of column names to create array of columnDef objects
    return element
  })

  // now slice the array to remove column names, leaving the grid data
  rowDefsArray = theDataArray.slice(1)

  columnClassNameAddOn = getHeaderClass(columnDefs)

  return (
    <div id={gridId} className={'grid-wrapper'}>
      <div id={headerWrapperId} className={'grid-header-wrapper'}>
        <GridHeader
          wrapperId={gridId}
          dataArray={columnDefs}
          columnClassNameAddOn={columnClassNameAddOn}
        />
      </div>
      <div id={dataWrapperId} className={'grid-data-wrapper'}>
        <GridRows
          wrapperId={gridId}
          dataArray={rowDefsArray}
          columnClassNameAddOn={columnClassNameAddOn}
          headerWrapperId={headerWrapperId}
          dataWrapperId={dataWrapperId}
        />
      </div>
    </div>
  )
}

GridContainer.propTypes = {
  tab_key: PropTypes.number.isRequired,
  chart_name: PropTypes.string.isRequired,
  data_object: PropTypes.object.isRequired,
}

export default GridContainer
