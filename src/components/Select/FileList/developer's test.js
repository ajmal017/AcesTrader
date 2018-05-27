// This is the developer's test of proper match between the index and data files.
// To be copied and pasted in marked location in FileList/index.js if needed again.

// Do a test to match planName between the index file and the plan file data file
let planNameArray
let planNameMatched = false
let firstHit = false
let mismatchedNames = examplefileindex.dataArray.map((objectA, index) => {
  planNameMatched = false // reset
  firstHit = false // reset
  //for each name in the index file, check for match in the data file
  if (objectA.name.indexOf('-buy') >= 0) {
    firstHit = true
    // debugger
  }
  planNameArray = examplefiledata.map((objectB, index) => {
    if (firstHit && objectB.name.indexOf('-buy') >= 0) {
      // debugger
    }

    if (!planNameMatched && objectA.name === objectB.name) {
      planNameMatched = true //objectA.name matched finally
    }
  })
  if (planNameMatched === false) {
    //name never matched
    if (process.env.NODE_ENV === 'development') {
      debugger
    } //developer testing
    return objectA.name //the mismatched index name
  }
})
// debugger // check the names in mismatchedNames

// Do a test to match planName between the index file and the chart data file
let chartNameArray
let chartNameMatched = false
let chartFirstHit = false
let chartMismatchedNames = examplefileindex.dataArray.map((objectA, index) => {
  chartNameMatched = false // reset
  chartFirstHit = false // reset
  //for each name in the index file, check for match in the data file
  if (objectA.name.indexOf('-buy') >= 0) {
    chartFirstHit = true
    // debugger
  }
  let objectB
  const newLocalB = examplechartdata[0]
  let newLocalKeysB = Object.keys(newLocalB) //keys of child objects
  let newLocalArrayB = newLocalKeysB.map((key, index) => {
    objectB = newLocalB[key].content
    if (chartFirstHit && key.indexOf('-buy') >= 0) {
      // debugger
    }
    // NOTE name.toLowerCase() is required to match the chart data file
    if (!chartNameMatched && objectA.name.toLowerCase() === key) {
      chartNameMatched = true //objectA.name matched finally
    }
  })
  if (chartNameMatched === false) {
    //name never matched
    if (process.env.NODE_ENV === 'development') {
      debugger
    } //developer testing
    return objectA.name //the mismatched index name
  }
})
// debugger // check the names in chartMismatchedNames

//========================================================
// More code moved here as a stash in case it is useful in the future
// to test the makeplanobject code used in duckFiles reducer.
//========================================================

// // Build one example planObject from a single plan XML file
// const dataStore = {}
// dataStore.planName = examplefiledata['name']
// dataStore.planFileData = theoneExamplefiledata['content'] //this a XML format file
// dataStore.planObject = null //to be provided
// makeplanobject.makeobject(dataStore) //create planObject, planJson, planJsonBase64 in dataStore
// console.log(dataStore.planJson)
// // console.log(JSON.stringify(dataStore.planJson, null, 2)) // a readable log of the object's json
// //planObjectZ
// let planObjectZ = dataStore.planObject //the finished planObject
