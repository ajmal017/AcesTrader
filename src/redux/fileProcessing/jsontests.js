// jsontests.js

exports.jsontest = (planObjectA) => {
  'use-strict'

  // eslint-disable-next-line
  var testNode = new Function(
    'try {return this===global;}catch(e){return false;}'
  ) //test for Node operation, not browser
  var isNode = testNode() //sets boolean flag indicating Node operation, not browser

  // This tests the working plan object by creating a new json string.
  // Then that json string is parsed to create a second plan object.
  // Then another json string is created from the second plan object.
  // The two json strings are compared and are expected to be equal.

  var jsonStringA = JSON.stringify(planObjectA) //the new json from the input plan object
  var planObjectB = JSON.parse(jsonStringA) //generate the second plan object from json
  var jsonStringB = JSON.stringify(planObjectB) //the second test json

  //test the cycle result by comparing the json files
  if (jsonStringA !== jsonStringB) {
    if (isNode) {
      debugger //break here for coder to inspect error
    }
    return false // exit with false result
  }
  return true
}
