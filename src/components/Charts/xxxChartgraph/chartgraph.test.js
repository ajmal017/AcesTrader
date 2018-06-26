import React from 'react';
import Chartgraph from "../Chartgraph";
import examplechartdata from '../../../lib/examplechartdata'

import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

const chartData = examplechartdata['saving then retirement'];
const chartcontent = chartData.content;
const chart_name = "Plan Overall Results"

describe('Chartgraph', () => {

    // this component does not render any DOM

    it('renders without crashing', () => {
        shallow(<Chartgraph chart_name={chart_name} data_object={chartcontent} />);
    });

});

