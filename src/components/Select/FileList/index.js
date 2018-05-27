// FileList

// Prepares a list of plan names for the PlanListPanel.
// The selected file name is recieved back and used to collect
// the file data to be passed back to Open where
// they are used to update the store's state via the app's routers.

import React from 'react'
import PropTypes from 'prop-types'
import examplefileindex from './examplefileindex'
import examplefiledata from './examplefiledata'
import examplechartdata from './examplechartdata'
import FilePanel from '../FilePanel'

// var makeplanobject = require('../../../redux/filemodules/makeplanobject')

// // This is the set up from older version of Forecaster (master branch)
// Use this to test reading XML files for input
// var oneExamplefiledata = require('./oneexamplefiledata.js')
// var theoneExamplefiledata = oneExamplefiledata.examplefiledata //XML format file data string

const FileList = (props) => {
  'use-strict'

  const handleLocalPlanClick = (planName) => (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    props.handlePlanClick(evt, planName)
  }

  const handleLocalExampleClick = (planName) => (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    let planNameLowerCase = planName.toLowerCase()
    // Get selected example planObject from a multiplan json file
    let planObject
    examplefiledata.map((object1, index) => {
      if (object1.name === planName) {
        planObject = object1.content
      }
      return null
    })
    // Get selected example chart data from a multidata json file
    let chartObject
    const newLocal = examplechartdata[0]
    let newLocalKeys = Object.keys(newLocal) //keys of child objects
    newLocalKeys.map((key, index) => {
      if (planNameLowerCase === key) {
        chartObject = newLocal[key].content
      }
      return null
    })
    props.handleExampleClick(evt, planName, planObject, chartObject)
  }

  // Make an array of the names of the example files
  const exampleNames = examplefileindex.dataArray.map((object, index) => {
    return object.name
  })

  return (
    <div className="namelist">
      <FilePanel
        dirty={props.dirty}
        planName={props.planName}
        plansList={props.plansList}
        exampleNames={exampleNames}
        handlePlanClick={handleLocalPlanClick}
        handleExampleClick={handleLocalExampleClick}
        handleDropdownClick={props.handlePlanClick}
      />
    </div>
  )
}

FileList.propTypes = {
  dirty: PropTypes.bool,
  planName: PropTypes.string,
  plansList: PropTypes.array,
  handlePlanClick: PropTypes.func,
  handleExampleClick: PropTypes.func,
}

// // examplePlanNames is an array of names for the individual plans available
// // ****Use this source for both plans and charts until the calculation engine is running, then
// // ****switch to the list of sample files for plans and call the calculation for chart data.
// let examplePlanNames = examplefileindex.dataArray.map((object, index) => {
//   return (
//     <li key={index} className="list-text" tabIndex="index">
//       <a
//         className="button"
//         onClick={handleLocalExampleClick(examplefileindex.dataArray[1])}>
//         <span className="button icon center_tree-cards" />
//         <span className="branchText">
//           <h4>{object.name}</h4>
//         </span>
//       </a>
//     </li>
//   )
// })

// return (
//   <div className="namelist">
//     <ul className="bb">{examplePlanNames}</ul>
//   </div>
// )
// }

export default FileList
