// Plan.test

import React from "react"
import renderer from "react-test-renderer"
import Plan from "../Plan"

import examplefiledata from "../../lib/examplefiledata.json" //mutiple sample files in JSON format; the import parses the json into js object

import { shallow, mount, configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

var makecrumbs = require("../../lib/makebreadcrumbs") //parses the plan object to install the breadcrumbs

configure({ adapter: new Adapter() })

//Handle all callback clicks
const handleClick = function() {
  return null
}

// list of icon menu items for the editing toolbar for the plan view
const toolbarPlan = [
  // The disabled property is optional: default is disable=false
  { iconName: "edit", buttonLabel: "Edit" },
  { iconName: "deleteitem", buttonLabel: "Delete" },
  { iconName: "deposit", buttonLabel: "Deposit" },
  { iconName: "withdraw", buttonLabel: "Wthdrw" },
  { iconName: "transfer", buttonLabel: "Xfer" },
  { iconName: "cost", buttonLabel: "Cost" },
  { iconName: "beneficiary", buttonLabel: "Bnfcry" },
  { iconName: "parameterchange", buttonLabel: "Parchg" },
]

const planName = "Saving then retirement"
let planObjectArray = examplefiledata.filter(
  (obj) => obj.name === planName //search for this plan
)
const planObject = planObjectArray[0].content

var dataStore = {
  //dummy dataStore
  planName: planName, // plan name
  planObject: planObject, // plan model object
  selectedTreeNode: "", //breadcrumbs to select tree node on startup
}

makecrumbs.makepath(dataStore) //add breadcrumbs to the planObject

describe("Plan", () => {
  it("renders without crashing", () => {
    shallow(
      <Plan
        dataStore={dataStore}
        toolbarItems={toolbarPlan}
        handleClick={handleClick}
      />
    )
  })
})

describe("Plan Snapshot", () => {
  it("renders a Snapshot without error", () => {
    const planviewHostId = "planview-host"
    const planviewHost = global.document.createElement("div")
    planviewHost.id = planviewHostId
    global.document.body.appendChild(planviewHost)

    const planviewContainerId = "planview-container"
    const planviewContainer = global.document.createElement("div")
    planviewContainer.id = planviewContainerId
    global.document.body.appendChild(planviewContainer)

    const component = mount(
      <Plan
        dataStore={dataStore}
        toolbarItems={toolbarPlan}
        handleClick={handleClick}
      />
    )
    expect(component.getElements()).toMatchSnapshot()
  })
})
