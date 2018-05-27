// PlanGrid

// container for the node data

import React from 'react'
import { objectQuery } from '../../../lib/navigateBreadCrumbs'
import PlanGridRows from '../PlanGridRows'
import getSelectedData from './getSelectedData.js'
import PropTypes from 'prop-types'
import './styles.css'

const PlanGrid = (props) => {
  'use-strict'
  let dataStore = props.dataStore
  let planObject = dataStore.planObject
  let selectedTreeNode = dataStore.selectedTreeNode
  let columnClassNameAddOn = 'grid-layout-2cols'

  // Use the selected breadcrumbs to get the plan object for gridlines.js to get an array of arrays.

  let breadcrumbs = selectedTreeNode
  if (breadcrumbs.length > 0) {
    //a selected node exists
    let target = objectQuery(breadcrumbs, planObject)
    let theDataArray = getSelectedData({
      myObject: target,
      targetPath: breadcrumbs,
      planObject: planObject,
    })

    if (theDataArray.length > 0) {
      return (
        <div id="datagrid-wrapper" className={'plan-grid-wrapper'}>
          <div className={'plan-grid-data-wrapper'}>
            <PlanGridRows wrapperId="plangrid2A" dataArray={theDataArray} columnClassNameAddOn={columnClassNameAddOn} headerWrapperId="datagrid1" dataWrapperId="datagrid2" />
          </div>
        </div>
      )
    } else {
      return <h3 className={'center'}>No plan data was found</h3>
    }
  }
}
PlanGrid.propTypes = {
  dataStore: PropTypes.object.isRequired,
}
export default PlanGrid
