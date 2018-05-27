// makeplanobject

// Convert data input string ( base64, xml, or json) into a plan object.

// And then use the convertplanobject module to modify the plan object as obtained
// from the xml2json conversion to an object with a more readable child object format.

// And even further, modify the resulting JSON to replace legacy property names with new ones,
// i.e. replace "payin" with "cost".

// This import creates a POJO single element array containing the default plan object,
import defaultPlan from '../../json/defaultPlan.json'

export const makeobject = (store, testStore) => {
  'use-strict'
  //testStore only present during testing in the Xml2js.js program

  // The store.planFileData string contains
  // input data as read from storage or as imported by users.
  // Possible formats include base64 as the coded storage format,
  // or xml from legacy users, or json in the new file format.

  var convertplan = require('./convertplanobject')
  var convertjson = require('./convertjson')
  var makecrumbs = require('./makebreadcrumbs') //parse the plan object to update the breadcrumbs
  var cloneDeep = require('lodash.clonedeep')

  var base64 = require('base-64')
  var xml2json = require('./xml2json')
  var jsontests = require('./jsontests')

  if (store.planFileData) {
    let dataInput = store.planFileData //move input string to work area

    if (/^PD94/.test(dataInput)) {
      //this input is base64 encoded XML characters: the legacy file format

      // -Stage1 logic-
      dataInput = base64.decode(dataInput) //start the conversion
      if (/^<\?xml/.test(dataInput)) {
        //file should be xml string
        store.planXml = dataInput
        store.planObject = {} //initialize for error test - stays same on error
        xml2json.buildPlanObject(dataInput, store.planObject) //build plan object tree from the plan's xml file
        if (!(store.planObject.forecaster || store.planObject.moneyplan)) {
          //xml parse failed to create plan's js object
          if (process.env.NODE_ENV !== 'production') {
            debugger
          } //pause for developer inspection
          //throw new AppException("Failed to parse xml data");
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          debugger
        } //pause for developer inspection
        //throw new AppException("Failed to verify input as xml data");
      }
      if (testStore) {
        testStore.planObject1 = cloneDeep(store.planObject) //copy this stage1 result
      }

      // -Stage2 logic-
      // Legacy file format conversion is done by changing the input plan object built from the xml file
      // The plan object is changed to have every child object in an array whether one child or more.

      convertplan.convertobject(store) //create the converted object by changing the store's copy of the planObject
      // store.planObject is now the converted plan object
      store.planJson = JSON.stringify(store.planObject) //the new json
      if (testStore) {
        testStore.planObject2 = cloneDeep(store.planObject) //copy this stage2 object result
        testStore.planJson2 = store.planJson.slice() //copy this stage2 JSON result
      }

      //test that creating another convertedObject from the convertedObject is a NOP
      var clonedStore = cloneDeep(store) // clone a copy for this test
      convertplan.convertobject(clonedStore)
      let convertedJson = JSON.stringify(clonedStore.planObject)
      if (store.planJson !== convertedJson) {
        console.log(JSON.stringify(clonedStore.planObject, null, 2)) // a readable log of the object's json
        if (process.env.NODE_ENV !== 'production') {
          debugger
        } // second conversion is NOT the expected noop
      }
    } else if (/^eyJm/.test(dataInput)) {
      //this input is base64 encoded json characters: the new file format
      store.planBase64 = dataInput
      dataInput = base64.decode(dataInput)
      store.planJson = dataInput //the input json
      store.planObject = JSON.parse(dataInput) //the plan object from input json
    } else {
      //input is a plain json string: from a file of legacy example plan json strings
      store.planJson = dataInput //the input json
      store.planObject = JSON.parse(dataInput) //the plan object from input json
    }

    // -Stage3 logic-
    //Now use the store.planJson and refactor obsolete property names
    var planJson3 = convertjson.convertdata(store) //do the stage3 conversion to get a new json
    store.planObject = JSON.parse(planJson3) //the plan object from converted json
    store.planJson = planJson3.slice() //the converted json
    if (testStore) {
      testStore.planObject3 = cloneDeep(store.planObject) //copy this stage3 object result
      testStore.planJson3 = store.planJson.slice().slice() //copy this stage3 JSON result
    }

    // -Stage4 logic-
    // Process the plan object to create the "breadcrumbs" property in each child object
    makecrumbs.makepath(store) //from the stage3 update logic
    if (testStore) {
      testStore.planObject4 = cloneDeep(store.planObject) //copy this stage4 object result
      testStore.planJson4 = JSON.stringify(store.planObject, null, 2) //the plan object from new json
    }

    // test the planObject to planJson loop before the Object.assign() method call
    if (!jsontests.jsontest(store.planObject)) {
      //object to json loop test failed
      if (process.env.NODE_ENV !== 'production') {
        debugger
      } //pause for developer inspection
      //TODO throw new AppException("Input data failed json loop test");
    }

    // The Object.assign call is a shallow merge that just updates the sparse
    // default plan object with complete data from the input file.
    store.planObject.forecaster = Object.assign({}, defaultPlan.forecaster, store.planObject.forecaster)
  } else {
    store.planObject = defaultPlan //start a new plan object
  }

  if (!jsontests.jsontest(store.planObject)) {
    //if test fails, object to json loop test failed
    if (process.env.NODE_ENV !== 'production') {
      debugger
    } //pause for developer inspection
    //TODO throw new AppException("Final input data failed json loop test");
  }

  // Final values are saved now
  store.planJson = JSON.stringify(store.planObject) //the final json from store.planObject
  store.planJsonBase64 = base64.encode(store.planJson) //for output to external storage; add ".mpx" extension

  // console.log(JSON.stringify(store.planJson, null, 2)) // a readable log of the object's json
  // debugger

  return store.planJson //this is used for testing
}
