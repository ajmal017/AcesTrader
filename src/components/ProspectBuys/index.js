// PotentialBuys/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { notification } from '../../redux/reducerModal'
import AppToolbar from '../../components/AppToolbar'

// this is to get one chart's data for this mock display
import examplechartdata from '../../components/Charts/examplechartdata'

class PotentialBuys extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // Get an example chart data from a multidata json file for mock display
    let chartObject
    const planNameLowerCase = 'saving then retirement'
    const newLocal = examplechartdata[0]
    let newLocalKeys = Object.keys(newLocal) //keys of child objects
    newLocalKeys.map((key, index) => {
      if (planNameLowerCase === key) {
        chartObject = newLocal[key].content
      }
      return null
    })

    return <AppToolbar chartObject={chartObject} />
  }
}
export default PotentialBuys
