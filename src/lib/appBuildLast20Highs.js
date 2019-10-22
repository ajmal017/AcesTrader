// appBuildLast20Highs.js

import { putLast20Highs } from './chartDataCache'

const buildLast20Highs = (symbol, dailyPriceData) => {
  let last20Prices = dailyPriceData.slice(-20)
  let last20Highs = last20Prices.map((obj) => {
    return { close: obj.high, date: obj.date }
  })
  putLast20Highs(symbol, last20Highs)
}
export default buildLast20Highs
