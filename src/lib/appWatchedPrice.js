// appWatchedPrice.js

let currentWatchedPrices = {}

export const resetWatchedPrices = () => {
  currentWatchedPrices = {}
}

export const putWatchedPrice = (symbol, price) => {
  currentWatchedPrices[symbol] = price
}

export const getWatchedPrice = (symbol) => currentWatchedPrices[symbol]
export const getWatchedPrices = () => currentWatchedPrices

export const finishWatchedPrices = () => {}
