//appBuildSma40Array.js

import { putSma40Data, putLast20Closes } from './chartDataCache'
import { initSma, addSmaPrice, getSmaArray } from './appMovingAverage'

const buildSma40Array = (symbol, weeklyPriceData) => {
  initSma(40, weeklyPriceData.length)
  for (let kk = 0; kk < weeklyPriceData.length; kk++) {
    addSmaPrice(weeklyPriceData[kk].close, weeklyPriceData[kk].date)
  }
  let smaArray = getSmaArray() //gets the calculated sma values
  putSma40Data(symbol, smaArray) //cache the sma40 data for subsequent use for weekly chart alerts
}
export default buildSma40Array
