// chartcell.test.js

import React from 'react';
import Chartcell from "../Chartcell";
import examplechartdata from '../../../lib/examplechartdata'
import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

const chartData = examplechartdata['saving then retirement'];
const chartcontent = chartData.content;
//const chart_name = "Plan Overall Results"

const chartkeys = Object.keys(chartcontent); // Chart names: multiple items
const chart_name = chartkeys[0]
const cell_id = chartkeys[0].replace(/[\W_]/g, '')

describe('Chartcell', () => {

    // this component does not render any DOM besides some wrapper DIVs

    it('renders without crashing', () => {
        shallow(<Chartcell cell_id={cell_id} chart_name={chart_name} data_object={chartcontent} />);
    });

});

