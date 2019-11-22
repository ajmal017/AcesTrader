//appBuildLast20Closes.js

import { putLast20Closes } from './chartDataCache'

const buildLast20Closes = (symbol, dailyPriceData) => {
  let last20Prices = dailyPriceData.slice(-20)
  let last20Closes = last20Prices.map((obj) => {
    return { close: obj.close, date: obj.date }
  })
  putLast20Closes(symbol, last20Closes)
}
export default buildLast20Closes
