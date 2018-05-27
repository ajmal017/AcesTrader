// Chartcell
// See readme.txt for all reference links.

import React from 'react'
import PropTypes from 'prop-types'
import Chartgraph from '../Chartgraph'
import Charttabs from '../Charttabs'
import './styles.css'

const Chartcell = (props) => {
  'use-strict'
  const { cell_id, chart_name, data_object } = props
  return (
    <div className="chart-cell-wrapper">
      <div id={cell_id} className="chart-cell">
        <div className="chart-title">{chart_name}</div>
        <div className="graph-content">
          <Chartgraph chart_name={chart_name} data_object={data_object} />
        </div>
        <div className={'tabs-content'}>
          <Charttabs
            cell_id={cell_id}
            chart_name={chart_name}
            data_object={data_object}
          />
        </div>
      </div>
    </div>
  )
}

Chartcell.propTypes = {
  //cell_index: React.PropTypes.number.isRequired,
  // eslint-disable-next-line
  cell_id: PropTypes.string.isRequired,
  chart_name: PropTypes.string.isRequired,
  data_object: PropTypes.object.isRequired,
}

export default Chartcell
