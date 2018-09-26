// appWatchedPrice.js

let currentWatchedPrices = {}
let callBack = {}

export const resetWatchedPrices = () => {
  currentWatchedPrices = {}
}

export const putWatchedPrice = (symbol, price) => {
  currentWatchedPrices[symbol] = price
}

export const getWatchedPrice = (symbol) => currentWatchedPrices[symbol]
export const getWatchedPrices = () => currentWatchedPrices

export const finishWatchedPrices = () => {
  let test = currentWatchedPrices
  //debugger
}
