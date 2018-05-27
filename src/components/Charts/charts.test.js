import React from 'react';
import renderer from 'react-test-renderer';
import examplechartdata from '../../lib/examplechartdata'
import Charts from "../Charts";
import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const planJson = "planJson"; //used by Charts to test for new plan
const chartObject = examplechartdata['saving then retirement'];;

describe('Charts', () => {
    it('renders without crashing', () => {
        shallow(<Charts chartObject={chartObject} planJson={planJson} />);
    });
});

describe("Charts Snapshot", () => {
  it("renders a Snapshot without error", () => {
    const component = mount(<Charts chartObject={chartObject} planJson={planJson} />  );
    expect(component.getElements()).toMatchSnapshot();
  });
});


