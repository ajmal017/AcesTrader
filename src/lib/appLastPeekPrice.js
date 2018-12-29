// appLastPeekPrice.js

let currentPeekPrices = {}

export const resetPeekPrices = () => {
  currentPeekPrices = {}
}

export const putPeekLastPrice = (symbol, price) => {
  currentPeekPrices[symbol] = price
}

export const getPeekLastPrice = (symbol) => currentPeekPrices[symbol]
export const getPeekPrices = () => currentPeekPrices

export const finishPeekPrices = () => {}
