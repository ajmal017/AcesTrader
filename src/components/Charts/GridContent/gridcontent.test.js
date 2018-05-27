// gridcontent.test.js

// NOTE: SOME TESTS HERE ARE NOT USED SINCE THE GRIDROWS COMPONENT
// NEEDS TO USE THE GRIDHEADER COMPONENT DOM IN ITS RENDERING,
// SO ONLY THE GRIDHEADER CAN BE TESTED HERE.
// THE TWO ARE TESTED TOGETHER IN THE GRIDCONTAINER.TEST.JS FILE.

import React from "react";
import renderer from "react-test-renderer";

import { shallow, mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { GridHeader, GridRows } from "../GridContent";
//*****chartData is supplied by a canned example*****
import examplechartObject from "../../../lib/examplechartdata.json"; //NOTE: This import parses the json into js object

configure({ adapter: new Adapter() });

const plan_name = "saving then retirement"; // this is a representative sample
const chart_name = "Living Trust"; // this is a chartdata source with 8 columns
const chartData = examplechartObject[plan_name];
const chartcontent = chartData.content;

// use a chartdata source with 8 columns
const chartdata_array = chartcontent[chart_name].chartdata;

//map the 1st row of column names to create array of columnDef objects
const columnDefs = chartdata_array[0].map((element, index) => {
  return element;
});
//the remaining rows are the grid's data
const rowDefsArray = chartdata_array.slice(1);

describe("GridHeader", () => {
  it("renders a header row without crashing", () => {
    shallow(
      <GridHeader
        wrapperId={"dummyId"}
        dataArray={columnDefs}
        columnClassNameAddOn={"grid-layout-8cols"}
      />
    );
  });
});

describe("GridRows", () => {
  it("renders a data grid without crashing", () => {
    shallow(
      <GridRows
        wrapperId={"dummyId"}
        headerWrapperId={"dummyheaderId"}
        dataWrapperId={"dummydataId"}
        dataArray={rowDefsArray}
        columnClassNameAddOn={"grid-layout-8cols"}
      />
    );
  });
});

describe("GridHeader Snapshot", () => {
  it("renders a Snapshot without error", () => {
    const tree = renderer
      .create(
      <GridHeader
        wrapperId={"dummyId"}
        dataArray={columnDefs}
        columnClassNameAddOn={"grid-layout-8cols"}
      />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("GridRows Snapshot", () => {
  it("renders a Snapshot without error", () => {
    const component = mount(
      <GridRows
        wrapperId={"dummyId"}
        headerWrapperId={"dummyheaderId"}
        dataWrapperId={"dummydataId"}
        dataArray={rowDefsArray}
        columnClassNameAddOn={"grid-layout-8cols"}
      />
    );
    expect(component.getElements()).toMatchSnapshot();
  });
});

// We do not test the journal data grid rendering,
// since the program logic is the same as the yearly data grid
// the journaldata source always has 3 columns
const journaldata_array = chartcontent[chart_name].journaldata;
