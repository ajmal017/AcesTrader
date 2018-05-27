// GridContainer.test.js

import React from "react"
import { shallow, mount, configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import GridContainer from "../GridContainer"

//*****chartData is supplied by a canned example*****
import examplechartdata from "../../../lib/examplechartdata"

configure({ adapter: new Adapter() })

const chartData = examplechartdata["saving then retirement"]
const chartcontent = chartData.content
const chartkeys = Object.keys(chartcontent) // Chart names: multiple items
const chart_name = chartkeys[0]
const cell_id = chartkeys[0].replace(/[\W_]/g, "")

describe("GridContainer", () => {
  // this component does not render any DOM besides two wrapper DIVs
  it("renders Tab #1 without crashing", () => {
    shallow(
      <GridContainer
        tab_key={1}
        chart_name={chart_name}
        data_object={chartcontent}
      />
    )
  })
  it("renders Tab #2 without crashing", () => {
    shallow(
      <GridContainer
        tab_key={2}
        chart_name={chart_name}
        data_object={chartcontent}
      />
    )
  })
})

describe("GridContainer Snapshot", () => {
  it("renders a Snapshot without error", () => {
    const headerWrapperId = "PlanOverallResultsgrid1-header-wrapper"
    const headerWrapper = global.document.createElement("div")
    headerWrapper.id = headerWrapperId
    global.document.body.appendChild(headerWrapper)
    const component = mount(
      <GridContainer
        tab_key={1}
        id={"PlanOverallResultsgrid1"}
        chart_name={chart_name}
        data_object={chartcontent}
      />
    )
    expect(component.getElements()).toMatchSnapshot()
  })
})
