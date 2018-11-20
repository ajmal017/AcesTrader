// appSymbolDataObject.js

// This data is an array of objects, each with info about one symbol,
// created by ManageProspects calling putSymbolDataObjects when verifying a list of new prospect symbols.
// The array is used later with calls to getSymbolDataObject from addWatchPriceAndIssueTypeAsync()
// in the thunkEditListObjects.js file.

let currentSymbolDataObjects = []
// let dummySymbolDataObjects = [{ symbol: 'ALFA' }, { symbol: 'IBM' }]

export const resetSymbolDataObjects = () => {
  currentSymbolDataObjects = []
}

export const putSymbolDataObjects = (arr) => {
  currentSymbolDataObjects = [...arr]
}

export const getSymbolDataObject = (symbol) => {
  let foundDataObject = currentSymbolDataObjects.find((obj) => obj.data.symbol === symbol)
  return foundDataObject.data
}
