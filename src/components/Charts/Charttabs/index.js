// Charttabs

import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import GridContainer from '../GridContainer'
import './styles.css'

const Charttabs = (props) => {
  'use-strict'

  const { cell_id, chart_name, data_object } = props
  // const chart_type = data_object[chart_name].objecttype;
  // const chartdata_array = data_object[chart_name].chartdata;
  const tab1_title =
    chart_name === 'Plan Overall Results'
      ? 'Yearly Overall Results'
      : 'Yearly Results'
  const tab2_title =
    chart_name === 'Plan Overall Results'
      ? 'Estate Planning Events'
      : 'Transactions'

  // Note: In order to properly initialize Tabs in a way that is accessible
  // to assistive technologies (such as screen readers)
  // an ID prop to TabContainer is required, such as id={cell_id + "x"},
  // so the cell_id is paassed on for this use in Charttabcontent.

  return (
    <Tabs defaultActiveKey={1} className={'tabs'} id={cell_id + '0'}>
      <Tab eventKey={1} title={tab1_title}>
        <GridContainer
          tab_key={1}
          id={cell_id + '1'}
          chart_name={chart_name}
          data_object={data_object}
        />
      </Tab>
      <Tab eventKey={2} title={tab2_title}>
        <GridContainer
          tab_key={2}
          id={cell_id + '2'}
          chart_name={chart_name}
          data_object={data_object}
        />
      </Tab>
    </Tabs>
  )
}

Charttabs.propTypes = {
  cell_id: PropTypes.string.isRequired,
  chart_name: PropTypes.string.isRequired,
  data_object: PropTypes.object.isRequired,
}

export default Charttabs
