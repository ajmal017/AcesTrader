// appBuildLast20Lows.js

import { putLast20Lows } from './chartDataCache'

const buildLast20Lows = (symbol, dailyPriceData) => {
  let last20Prices = dailyPriceData.slice(-20)
  let last20Lows = last20Prices.map((obj) => {
    return { close: obj.low, date: obj.date }
  })
  putLast20Lows(symbol, last20Lows)
}
export default buildLast20Lows
