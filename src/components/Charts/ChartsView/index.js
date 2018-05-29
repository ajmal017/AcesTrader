// ChartsView
// See the app's readme.txt for all reference links to charting information.

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Chartcell from '../Chartcell'
import './styles.css'

export default class ChartsView extends Component {
  // constructor(props) {
  //     super(props);
  // }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  // Is this the right test?
  // shouldComponentUpdate(nextProps, nextState) {
  //     if (this.props.planJson === nextProps.planJson) {
  //         return false; //charts are already drawn for this case
  //     }
  //     return true;
  // }

  render() {
    const chartcontent = this.props.chartObject
    const chartkeys = Object.keys(chartcontent) // Chart names - multiple items

    if (chartkeys[0] === 'error') {
      // no chart data
      return (
        <div className="charts-host">
          <div className="error-cell">
            <div className="error-content">
              <h3>{chartcontent.error}</h3>
            </div>
          </div>
        </div>
      )
    }

    // Create an array of Chartcells, one for each chart & datagrid pair
    const cells = chartkeys.map(function(keyvalue, index) {
      const cell_id = keyvalue.replace(/[\W_]/g, '') // the Chartcell's cell_id value is used by the "Scroll To" method in the Apptoolbar
      return <Chartcell key={index.toString()} cell_id={cell_id} chart_name={keyvalue} data_object={chartcontent} />
    })

    return (
      <div id="charts-host" className="charts-host">
        {cells}
      </div>
    )
  }
}

ChartsView.propTypes = {
  chartObject: PropTypes.object.isRequired,
  // planJson: PropTypes.string,
}
