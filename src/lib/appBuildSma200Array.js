//appBuildSma200Array.js

import { putSma200Data } from './chartDataCache'
import { initSma, addSmaPrice, getSmaArray } from './appMovingAverage'

const buildSma200Array = (symbol, dailyPriceData) => {
  initSma(200, dailyPriceData.length)
  for (let kk = 0; kk < dailyPriceData.length; kk++) {
    addSmaPrice(dailyPriceData[kk].close, dailyPriceData[kk].date)
  }
  let smaArray = getSmaArray() //gets the calculated sma values
  putSma200Data(symbol, smaArray) //cache the sma200 data for subsequent use for chart alerts
}
export default buildSma200Array
