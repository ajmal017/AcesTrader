// appSymbolDataObject.js

let currentSymbolDataObjects = []
let dummySymbolDataObjects = [{ symbol: 'ALFA' }, { symbol: 'IBM' }]

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
