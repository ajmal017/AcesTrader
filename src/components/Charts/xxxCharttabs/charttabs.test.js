// Charttabs.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import TestUtils from 'react-dom/test-utils';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";
import Charttabs from '../Charttabs';
import GridContainer from '../GridContainer';
configure({ adapter: new Adapter() });

//*****chartData is supplied by a canned example*****
import examplechartdata from '../../../lib/examplechartdata'
const chartData = examplechartdata['saving then retirement'];
const chartcontent = chartData.content;
const chartkeys = Object.keys(chartcontent); // Chart names: multiple items
const chart_name = chartkeys[0]
const cell_id = chartkeys[0].replace(/[\W_]/g, '')

describe('Charttabs', () => {
    it('renders without crashing', () => {
        shallow(<Charttabs cell_id={cell_id} chart_name={chart_name} data_object={chartcontent} />);
    });

});

describe("Charttabs Snapshot", () => {
    it("renders a Snapshot without error", () => {
        const component = mount(<Charttabs cell_id={cell_id} chart_name={chart_name} data_object={chartcontent} />);
        expect(component.getElements()).toMatchSnapshot();
    });
});
