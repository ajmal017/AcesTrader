/* dataManager.js */

import _ from 'lodash'
import { UserException, AppException } from './exceptionObjects'
// import store from "./Store";

/* eslint no-unused-vars: 0, curly: 2 */

var FOBJ = require('./fobj') //gets the persistent global object of constants
// var exampleArray = require("./examplefileindex").dataArray;
// var examplefiledata = require("./examplefiledata").dataArray;
var examplechartdata = require('./examplechartdata')
// var xml2json = require("./xml2json");
// var xml2jstests = require("./xml2jstests");

// Note: examplechartdata.js file is used to produce charts for example plans before calculations are programmed.
// var sampleCharts = examplechartdata.getChartData("early ira withdrawals");

const defaultName = FOBJ.UNTITLEDFILENAME //default for the file name field
var inputBase64 = '' //the file data as loaded, still encoded as base64
var outputBas64 = '' //holds the output base64 encoded file data

const initialObject = {
  forecaster: {
    persons: [],
    accounts: [],
    iras: [],
    pensions: [],
    annuities: [],
    insurances: [],
    parameters: [],
  },
}
var xml2jsObject = {} //the plan object. Originally parsed from the input xml file, and updated since.

var currentFileName = defaultName
var currentCalculatedChartData = null
var rawInputData = ''
var savedData = '' //saved data matches what is in local storage
var currentData = '' //last edited data, available to rollback pending data edit, and/or to save to local storage
var pendingData = '' //edit transition's data pending completion of all required edit steps
var filechartName = '' //name of an EXAMPLE's calculation data for charts
var filechartData = '' //json data of EXAMPLE's calculation data for drawing example charts
var pendingFileData = '' //holds pending new data

// The two open functions obtain the plan data from local storage
// and base64 decode it and put the xml string data into the
// savedData and the two staged data buffers to initialize them
// for use by the planview module.

// Note that any opened plan's data remains in these buffers
// across user's actions to move to other views, so returning to
// the planview module shows the current plan again in its last state,
// unless a request is made to open another plan.

// ============Below are public entry points============

export function getCurrentPlanXml() {
  return currentData.length > 0 ? currentData : null
}

export function getInitialPlanObject() {
  return initialObject
}

export function getCurrentPlanObject() {
  return _.isEmpty(xml2jsObject) ? initialObject : xml2jsObject
}

export function getCurrentPlanName() {
  return currentFileName.length > 0 ? currentFileName : null
}

export function saveUserPlan(file) {
  currentFileName = file //user may have renamed the file
  alert('TODO - saveUserPlan') //====TODO====
}

export function deleteUserPlan(file) {
  currentFileName = defaultName //default for the file name field
  savedData = ''
  currentData = ''
  pendingData = ''
  xml2jsObject = {}
  //alert("TODO - Confirm deleteUserPlan"); //====TODO====
}

export function openUserPlan(fileName = defaultName) {
  try {
    let xmldata = ''
    if (!askPermission()) {
      //not okay to change the existing plan data
      return false //operation aborted by user's' choice
    }
    if (fileName === defaultName) {
      xml2jsObject = Object.assign({}, initialObject) //initialize with the empty plan data object
    } else {
      // Get the plan file from the user's local storage
      xmldata = initializePlanData(getUserPlan(fileName))
      if (xmldata.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          debugger
        } //developer testing
        throw new UserException("Didn't obtain file data")
      }
      parseXmlToJsObject(xmldata) // Convert the xml to JS object in the xml2jsObject variable
    }
    return newStateObject() // trigger state change and switch to plan view
  } catch (e) {
    //console.log(e.message, e.name); // pass exception object to console
    //e.extra = "openUserPlan had error.";
    if (process.env.NODE_ENV === 'development') {
      debugger
    } //developer testing
    return false //operation aborted, reason was reported
  }
}

export function openExamplePlan(fileName) {
  try {
    let xmldata = ''
    if (!askPermission()) {
      //not okay to change the existing plan data
      return false //operation aborted by user's' choice
    }

    // TODO
    // // Get the example plan file from the app static data
    // xmldata = initializePlanData(getExamplePlan(fileName)); //example plan obtained internally or via ajax

    if (xmldata.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        debugger
      } //developer testing
      throw new AppException("Didn't obtain example file data")
    }
    parseXmlToJsObject(xmldata) // Convert the xml to JS object in the xml2jsObject variable

    var inputBase64Test = inputBase64
    var currentDataTest = currentData
    var xml2jsObjectTest = xml2jsObject
    //if (process.env.NODE_ENV === "development") { debugger }; //developer testing

    return newStateObject() // trigger state change and switch to plan view
  } catch (e) {
    //console.log(e.message, e.name); // pass exception object to console
    //e.extra = "openExamplePlan had error.";
    if (process.env.NODE_ENV === 'development') {
      debugger
    } //developer testing
    return false //operation aborted, reason was reported
  }
}

// ==========Below are internal functions=============
function newStateObject() {
  let newplan = {}
  // build the new data object for the store.plan object
  newplan.name = currentFileName
  newplan.tree = Object.assign({}, xml2jsObject) //initialize with the new plan data object
  newplan.sorting = false
  newplan.selectedNode = ''
  return newplan
}

function parseXmlToJsObject(xmldata) {
  // // Convert the xml to a JS object
  // xml2jsObject = {}; //initialize for error test - stays same on error
  // xml2json.buildPlanObject(xmldata, xml2jsObject); //build plan object tree from the plan's xml file
  // if (!(xml2jsObject.forecaster || xml2jsObject.moneyplan)) {
  //   //xml parse failed to create plan's js object
  //   if (process.env.NODE_ENV === "development") {
  //     debugger;
  //   } //developer testing
  //   throw new AppException("Didn't parse xml data");
  // }
  // // This tests a plan object by a cycle of creating JSON strings and XML strings for comparisons.
  // let testResult1 = xml2jstests.testCurrentJS(xml2jsObject);
  // if (!testResult1) {
  //   if (process.env.NODE_ENV === "development") {
  //     debugger;
  //   } //developer testing
  //   throw new AppException("Test failed to cycle xml and json data");
  // }
}

// function getExamplePlan(fileName) {
//   currentFileName = fileName; //save for use by planview/treeview
//   // TODO - DOWNLOAD REMOTE FILE FROM SERVER
//   var demoFileData = ""; //the default
//   fileName = fileName.toLowerCase();
//   exampleArray.forEach(function(example, index) {
//     if (fileName === example.name.toLowerCase()) {
//       demoFileData = examplefiledata[index].content; //example's data
//       getExampleChartData(fileName, index); //get this now
//     }
//   });
//   return demoFileData;
// }

function getExampleChartData(fileName, exampleId) {
  // var exampleChartFileName = exampleArray[exampleId].chartfile; //example's chart file name
  // exampleChartFileName = exampleChartFileName.replace(" charts", ""); //remove trailing "charts" string
  // filechartName = exampleChartFileName.toLowerCase();
  // filechartData = examplechartdata[filechartName]; //saves the example chart's data points for example charting
  // // fileName = fileName.toLowerCase();
  // // filechartName = fileName; //saves the example chart file name for later planView use.
  // // filechartData = examplechartdata[fileName]; //saves the example chart's data points for example charting
  // // return true;
}

function getUserPlan(fileName) {
  currentFileName = fileName //save for use by planview/treeview

  alert('TODO - Load user plan') //====TODO====
  return defaultName

  // var exampleName = exampleArray[exampleId].name; //example's name to be passed as parameter to datacontext.js
  // var exampleDataFileName = exampleArray[exampleId].datafile;  //example's data file name

  // return (exampleArray[exampleId].content);  //example's data

  // // var exampleChartFileName = exampleArray[exampleId].chartfile; //example's chart file name to be passed as parameter to datacontext.js
  // // exampleChartFileName = exampleChartFileName.replace(" charts", ""); //remove trailing "charts" string
  // // exampleChartFileName = exampleChartFileName.toLowerCase();

  // if (datacontext.askPermission(exampleName)) { //if okay to load another file
  //     //var exampleFile = 'examplefiles/' + exampleDataFileName.toLowerCase() + ".js"; // complete the file's path
  //     //var exampleFileData = fs.readFileSync(exampleFile).toString();

  //     //get the file's data from the array of example data files
  //     var examplefiledataArray = require('./examplefiledata').dataArray;
  //     var exampleFileArray = examplefiledataArray.filter((value) => value.name === exampleName);
  //     var exampleFileData = exampleFileArray[0].content;
  //     datacontext.prepareExample(exampleFileData, exampleChartFileName);
  //     //router.navigate(targetView); //call targetView to view the loaded plan file
  //     return true; //the plan file has been loaded for user
  // } else { //user cancelled operation
  //     console.log("Return false from datacontext.askPermission");
  //     return false;
  // }
}

function askPermission() {
  // first we must test the current files status for dirty file data
  // then ask user if a save is desired before overwriting the current data
  let dataIsNotDirty = false // TODO // xml2jstests.testOutputXml(savedData, currentData, true); //test current status
  if (dataIsNotDirty) {
    return true //okay to change the data for new plan
  }
  alert('TODO - Unsaved file data, save or cancel') //====TODO==== prompt user for decision
  return false //assume user cancels
}

//function getExampleChartData(fileName) {
// filechartName = fileName; //saves the example chart file name for later planView use.
// filechartData = examplechartdata[fileName]; //saves the example chart's data points for example charting
// return true;
//}

function initializePlanData(fileInstance) {
  // This sets up a plan file for use by planview
  // input is the file data instance of the file (fileInstance),
  inputBase64 = fileInstance //coded file instance input
  // initialize all buffers to same startup state
  // the decoded savedData matches that which is in local storage
  if (typeof window === 'undefined') {
    //running under node.js
    savedData = new Buffer(inputBase64, 'base64').toString() //use nodejs
  } else {
    savedData = window.atob(inputBase64)
  }
  // update the buffers
  currentData = savedData //holds the changed, edited data, available to rollback an edit and/or to save to storage
  pendingData = savedData //holds editing transitions pending completion of all required edit transaction steps
  return savedData //the plan file information has been prepared for user
}
