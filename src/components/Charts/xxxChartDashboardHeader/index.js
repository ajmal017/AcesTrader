//ChartDashboardHeader/index.js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './styles.css'

class ChartDashboardHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const symbol = this.props.cellObject.symbol
    const tradeside = this.props.cellObject.dashboard.tradeSide

    return (
      <div className="dashboard-title">
        {symbol} - {tradeside}
      </div>
    )
  }
}
ChartDashboardHeader.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

export default ChartDashboardHeader
