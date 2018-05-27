// convertplanobject

// Converts the input plan object in place.
// The input from a legacy xml file is first converted to a plan object using the xml2json.js code.
// This first conversion to the plan object results in two different child object formats.
// A single child object is presented in a property with just that object.
// Multiple child objects are presented in an array of those objects.
// But the MoneyPlan business logic assume all children are presented in arrays.
// So a sencond conversion is done by this code to optimize the plan object.
// This converts all single object children to be an array holding the single child object.
// This is done for easier processing in the subsequent plan calculations.
// Also an additional property is added: "childObject.objecttype".

exports.convertobject = (store, testStore) => {
  'use-strict'

  var cloneDeep = require('lodash.clonedeep')

  var planObject = cloneDeep(store.planObject) //clone a local copy for this conversion

  // // Helper function for string edit.
  // //See the link below for documentation regarding this technique
  // //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  // const replacer = function (match, p1, p2, offset, string) {
  //     // p1 is the default property value (the key), p2 is the replacement property value
  //     var p3 = p2.toLowerCase();
  //     return [p1, p3].join('');
  // }

  // Hold a parent property name over recursive calls to getChildArray.
  // This allows an array of child objects to be matched to their parent.
  let parentName

  // Create an array of currentObject's child objects

  var getChildArray = (currentObject) => {
    let objectKeys = Object.keys(currentObject) //keys of object's properties

    if (currentObject.$ && currentObject.$.count === '1') {
      // only one other key besides "$"
      if (!Array.isArray(currentObject[objectKeys[1]])) {
        //this single child is NOT an array, i.e.: this plan has not yet been modified
        // the second key is an object property whose value we need to be wrapped in an array for ease in later caculations
        let holdingObject = currentObject[objectKeys[1]] //the single property value
        let newArray = []
        newArray.push(holdingObject)
        currentObject[objectKeys[1]] = newArray // Mutate this object !!!
      }
    }

    if (objectKeys[0] === '$') {
      objectKeys = objectKeys.slice(1) //remove 1st key="$"
      delete currentObject.$ //delete this property with count:value, use the array.length for count
    }

    // Save the name of the array to use for the value of childObject.objecttype
    // when the childObjects are in the array and their path breadcrumb uses
    // the "[index]" as the last token.
    if (Array.isArray(currentObject[objectKeys[0]])) {
      // this single child is an array of child objects
      parentName = objectKeys[0] //name of the array of child objects
    }

    let childKeys = objectKeys.filter(function(key) {
      //get only the child object keys
      return typeof currentObject[key] === 'object' && Object.keys(currentObject[key]).length > 0 //not an empty object
    })
    if (childKeys.length === 0) {
      return null //no child objects
    }

    let objectArray = childKeys.map((key, index) => {
      let childObject = currentObject[key] //a child object
      childObject.objecttype = key.replace(/\d+/, parentName)
      return childObject //now objectArray holds this child object
    })

    return objectArray
  }

  // For each object in objectParent, create an array of its child objects
  var processParentArray = (objectParent) => {
    for (let currentObject of objectParent) {
      let childArray = getChildArray(currentObject)
      if (childArray) {
        processParentArray(childArray) //this childArray is possibly a parent
      }
    }
  }

  // Start the conversion processing from here
  let currentObject = planObject.forecaster //the first parent object
  if (currentObject.$) {
    // the "$" property exists, so needs this immediate conversion below
    currentObject.meta = {} // define new property
    let metaKeys = Object.keys(currentObject.$)
    metaKeys.map((key, index) => {
      currentObject.meta[key] = currentObject.$[key]
      return null
    })
  }
  let childArray = getChildArray(currentObject) //get the top level child objects under currentObject: "forecaster"
  processParentArray(childArray)

  store.planObject = planObject //the converted plan object
  if (testStore) {
    testStore.planObject2 = cloneDeep(store.planObject) //copy this stage2 object result
    testStore.planJson2 = JSON.stringify(store.planObject, null, 2) //the new json
  }
}
