//appBuildSma50Array.js

import { putSma50Data } from './chartDataCache'
import { initSma, addSmaPrice, getSmaArray } from './appMovingAverage'

const buildSma50Array = (symbol, priceData) => {
  initSma(50, priceData.length)
  for (let kk = 0; kk < priceData.length; kk++) {
    addSmaPrice(priceData[kk].close, priceData[kk].date)
  }
  let smaArray = getSmaArray() //gets the calculated sma values
  putSma50Data(symbol, smaArray) //cache the sma50 data for subsequent use for daily chart alerts
}
export default buildSma50Array
