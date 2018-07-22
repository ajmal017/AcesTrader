//ChartDashboardFooter/index.js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

class ChartDashboardFooter extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    // const session = this.props.cellObject.dashboard.session
    // const duration = this.props.cellObject.dashboard.duration
    // const orderType = this.props.cellObject.dashboard.orderType
    // const quantityType = this.props.cellObject.dashboard.quantityType
    // const quantity = this.props.cellObject.dashboard.quantity
    const instruction = this.props.cellObject.dashboard.instruction

    return null
    // return (
    //   <div className="dashboard-buttons">
    //     <button className="place-order-button">PLACE {instruction} ORDER</button>
    //   </div>
    // )
  }
}
ChartDashboardFooter.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

export default ChartDashboardFooter
