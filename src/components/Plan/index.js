// Plan
// This is the container for the nested Plan components

import React from 'react'
import PropTypes from 'prop-types'
import PlanView from './PlanView/'

const Plan = (props) => {
  'use-strict'
  return (
    <PlanView dataStore={props.dataStore} handleClick={props.handleClick} />
  )
}

Plan.propTypes = {
  dataStore: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default Plan
