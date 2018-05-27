// reactchartline.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ReactChartLine from './../ReactChartLine';
import ChartLineGraphData from '../../components/ChartLineGraphData';

import examplechartdata from './../../lib/examplechartdata'
const chartData = examplechartdata['saving then retirement'];
const chartcontent = chartData.content;
// const chart_name = "Plan Overall Results"
const props = { chart_name: "Plan Overall Results", data_object: chartcontent }
// returns the data formated for the chart.js line chart.
const data = ChartLineGraphData(props)

describe('ReactChartLine', () => {

    it('renders without crashing', () => {
        shallow(<ReactChartLine data={data} />);
    });

});
