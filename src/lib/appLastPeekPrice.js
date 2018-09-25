// appLastPeekPrice.js

let currentPeekPrices = {}
let callBack = {}

export const resetPeekPrices = () => {
  currentPeekPrices = {}
}

export const putPeekPrice = (symbol, price) => {
  currentPeekPrices[symbol] = price
}

// export const getPeekPrice = (symbol) => currentPeekPrices[symbol]
export const getPeekPrices = () => currentPeekPrices

export const finishPeekPrices = () => {
  let test = currentPeekPrices
  //   callBack(currentPeekPrices)
  //debugger
}
