// Charts/index.js
// This is the container for the nested Charts components

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ChartsView from './ChartsView'

import './styles.css'

const Charts = (props) => {
  if (props.chartArray.length > 0) {
    return (
      <div id={'chartscontainer'}>
        <ChartsView handleClick={props.handleClick} chartArray={props.chartArray} />
      </div>
    )
  } else {
    return (
      <>
        <h3 className='error'> There are no entries in the {props.originList} list</h3>
        <h3 className='error'> Use the "Edits" menu to add symbols to watch</h3>
      </>
    )
  }
}

Charts.propTypes = {
  originList: PropTypes.string.isRequired,
  chartArray: PropTypes.array.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(Charts)

// export default Charts
