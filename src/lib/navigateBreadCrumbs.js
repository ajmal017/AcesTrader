// navigateBreadCrumbs.js

/* 2017 *********************************************************** */
// The objectQuery code below is using the reduce method and the path breadcrumbs to get the target object.
// see: https://www.bennadel.com/blog/3133-code-kata-using-array-reduce-to-navigate-an-object-graph-in-javascript.htm
/* *************************************************************** */
export const objectQuery = function(path, root) {
  'use-strict'
  let target = path.split('.').reduce((previousValue, navigationToken) => {
    return previousValue && previousValue[navigationToken]
  }, root) // start at the root of the object graph.
  return target
}

// NOTE: An example of a breadcrumb path is for a transfer instruction for an IRA account
// where the breadcrumbs look like this:
//     "forecaster.iras.ira.1.transfers.transfer.2"
// The forecaster object has a child property named "iras" which is the parent of a collection object of IRAs.
// The collection object of IRAs named "ira" is an array of IRA objects, and this path points to the second one (index=1).
// That IRA object has a child property named "transfers", which is the parent of a collection object of transfer instructions.
// The collection object of transfers named "transfer" is an array of transfer objects, and the path points to the third one (index=2).

// To get the parent object of the transfer instruction object, you perform an operation
// reducing the breadcrumbs string in four steps, as shown in the strings below.
// Start with the path showing the index of the instruction object in the array.
// End with the path showing the index of the parent asset object in that array.
//    "forecaster.iras.ira.1.transfers.transfer.2"
//    "forecaster.iras.ira.1.transfers.transfer"
//    "forecaster.iras.ira.1.transfers"
//    "forecaster.iras.ira.1"

export const getInstructionParentPath = function(startPath) {
  'use-strict'

  let tokens = startPath.split('.')

  if (/\d+/.test(tokens[tokens.length - 1])) {
    //this is an array index for the target object, we go one higher to the array path
    tokens = tokens.splice(0, tokens.length - 1) //get path to the array holding the target object
  } else {
    debugger // halt for developer
  }

  if (!/\d+/.test(tokens[tokens.length - 1])) {
    //this is the path to an array of instructions
    tokens = tokens.splice(0, tokens.length - 1) //get path to the collection object holding the array
  } else {
    debugger // halt for developer
  }

  if (!/\d+/.test(tokens[tokens.length - 1])) {
    //this is the path to the collection object holding the array of instructions
    tokens = tokens.splice(0, tokens.length - 1) //get path to the parent of the collection object holding the array of instructions
  } else {
    debugger // halt for developer
  }

  let parentPath = tokens.join('.')
  return parentPath
}

export const getInstructionCollectionPath = function(startPath) {
  'use-strict'
  let tokens = startPath.split('.')

  if (/\d+/.test(tokens[tokens.length - 1])) {
    //this is an array index for the target object, we go one higher to the array path
    tokens = tokens.splice(0, tokens.length - 1) //get path to the array holding the target object
  } else {
    debugger // halt for developer
  }

  if (!/\d+/.test(tokens[tokens.length - 1])) {
    //this is the path to an array of instructions
    tokens = tokens.splice(0, tokens.length - 1) //get path to the collection object holding the array
  } else {
    debugger // halt for developer
  }

  let collectionPath = tokens.join('.')
  return collectionPath
}

// Obsolete early 2018
// export const getParentParentPath = function(startPath) {
//   'use-strict'
//   let ownPath = startPath //start from here
//   let parentPath = getInstructionParentPath(ownPath)
//   let parentParentPath = getInstructionParentPath(parentPath)
//   return parentParentPath
// }
