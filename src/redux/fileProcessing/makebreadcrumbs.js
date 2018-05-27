// makebreadcrumbs.js

// The "store" object parameter has a planObject property that is referenced
// for processing (mutation) in the caller's "store" object for later use by the caller.
// Also, the finished planObject is returned alone to the caller for use alone.
// We parse the planObject in depth to create a breadcrumb path for each child.
// This needs to be done on legacy plan objects, and on planObjects built from
// example files. Also on every render of planObject after state change, since
// child objects can be created or removed, changing local breadcrumbs, and also
// child objects can change position in their parent's array after a drag-n-drop.

// The testStore is only provided for use in unit testing.

exports.makepath = (store, testStore) => {
  'use-strict'

  // Note: the differnt levels are called as the plan object is parsed down through its nested objects.
  // The processing starts at line 152.

  var level3 = (parentObject) => {
    let objectKeys = Object.keys(parentObject) //keys of child objects
    if (objectKeys.length === 0) return
    let childKeys = objectKeys.filter(function(key) {
      //get just the tree node child object keys
      return typeof parentObject[key] === 'object'
    })
    if (childKeys.length === 0) return

    if (process.env.NODE_ENV === 'development') {
      debugger //Should never get here since level3 objects are plan instructions without children
    } //developer testing

    // let levelArray = childKeys.map((key, index) => { //array of child objects
    //     let childObject = parentObject[key]; //next level object
    //     if (Array.isArray(childObject)) { //this child is an array holding multiple children, so map it for the actual children
    //         childObject.map((obj, index) => {
    //             // Handle one of multiple child components
    //             obj.breadcrumbs = parentObject.breadcrumbs + "." + key + ".[" + index + "]"; //the path to this child object; it gets special decoding for the array index
    //             level4(obj) //go to next level
    //             return null
    //         });
    //     } else { //this is a single child object
    //         childObject.breadcrumbs = parentObject.breadcrumbs + '.' + key; //the path to this object
    //         level4(childObject) //go to next level
    //     }
    //     return null
    // });
  }

  var level2 = (parentObject) => {
    // This level2 object can have zero or more child objects.
    let objectKeys = Object.keys(parentObject) //keys of child objects
    if (objectKeys.length === 0) return
    let childKeys = objectKeys.filter(function(key) {
      //get just the tree node child object keys
      return typeof parentObject[key] === 'object'
    })
    if (childKeys.length === 0) return

    childKeys.map((key, index) => {
      //array of child objects
      let childObject = parentObject[key] //next level object

      if (Array.isArray(childObject)) {
        //this child is an array holding multiple children, so map it for the actual children
        childObject.map((obj, index) => {
          // Handle one of multiple child components
          obj.breadcrumbs = parentObject.breadcrumbs + '.' + key + '.' + index //add the index into this key's child array; it gets special decoding as an array index
          // obj.breadcrumbs = parentObject.breadcrumbs + "." + key + ".[" + index + "]"; //the path to this child object; it gets special decoding for the array index
          level3(obj) //go to next level????
          return null
        })
      } else {
        //this is a single child object
        childObject.breadcrumbs = parentObject.breadcrumbs + '.' + key //the path to this object
        // level3(childObject) //go to next level????
      }
      return null
    })
  }

  var level1 = (parentObject) => {
    // This level1 object can have zero or more child objects.

    let objectKeys = Object.keys(parentObject) //keys of child objects
    if (objectKeys.length === 0) return
    let childKeys = objectKeys.filter(function(key) {
      //get just the tree node child object keys
      return typeof parentObject[key] === 'object'
    })
    if (childKeys.length === 0) return

    childKeys.map((key, index) => {
      //process the next level child objects
      let childObject = parentObject[key] //next level object

      if (Array.isArray(childObject)) {
        //this child is an array holding multiple children, so map it for the actual children
        childObject.map((obj, index) => {
          // Handle one of multiple child components
          obj.breadcrumbs = parentObject.breadcrumbs + '.' + key + '.' + index //add the index into this key's child array; it gets special decoding as an array index
          // obj.breadcrumbs = parentObject.breadcrumbs + "." + key + ".[" + index + "]"; //the path to this child object; it gets special decoding for the array index
          level2(obj) //go to next level
          return null
        })
      } else {
        //this is a single child object
        childObject.breadcrumbs = parentObject.breadcrumbs + '.' + key //the path to this object
        level2(childObject) //go to next level
      }

      return null
    })
  }

  var level0 = (parentObject) => {
    // At this level0 parent object, there should be zero or one child object in the store's model planObject.
    // If one is present, it is either one single object or an array of multiple objects.
    // These in turn, represent the child tree node or nodes.

    let objectKeys = Object.keys(parentObject) //keys of child objects
    if (objectKeys.length === 0) return
    let childKeys = objectKeys.filter(function(key) {
      //get just the tree node child object keys
      return typeof parentObject[key] === 'object'
    })
    if (childKeys.length === 0) return

    childKeys.map((key, index) => {
      //process the next level child objects
      let childObject = parentObject[key] //next level object

      if (Array.isArray(childObject)) {
        //this child is an array holding multiple children, so map it for the actual children
        childObject.map((obj, index) => {
          // Handle one of multiple child components
          obj.breadcrumbs = parentObject.breadcrumbs + '.' + key + '.' + index //add the index into this key's child array; it gets special decoding as an array index
          // obj.breadcrumbs = parentObject.breadcrumbs + "." + key + ".[" + index + "]"; //the path to this child object; it gets special decoding for the array index
          level1(obj) //go to next level
          return null
        })
      } else {
        //this is a single child object
        childObject.breadcrumbs = parentObject.breadcrumbs + '.' + key //the path to this object
        level1(childObject) //go to next level
      }

      return null
    })
  }

  let planObject = store.planObject //reference the object for mutation
  let parentObject = planObject.forecaster //the top level parent object
  parentObject.breadcrumbs = 'forecaster'

  let objectKeys = Object.keys(parentObject) //keys of first child objects
  if (objectKeys.length === 0) return
  let childKeys = objectKeys.filter(function(key) {
    //get just the tree node child object keys
    return typeof parentObject[key] === 'object' && key !== 'assignedsourceranks' && key !== 'ObjectType'
  })
  if (childKeys.length === 0) return
  childKeys.map((key, index) => {
    //array of child objects
    let childObject = parentObject[key] //next level object
    childObject.breadcrumbs = parentObject.breadcrumbs + '.' + key //the path to this child object
    level0(childObject) //go to next level
    return null
  })
  //finished with all the nested calls to lower levels
  //the planObject has been mutated in place in the first parameter "store" object
  if (testStore) {
    testStore.planObject4 = planObject //the updated object model
    testStore.planJson4 = JSON.stringify(planObject, null, 2) //the new json
  }
  return planObject //the updated object model
}
