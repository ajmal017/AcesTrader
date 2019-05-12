// appBuildSmaTradingArray.js

import { putSmaTradingData } from './chartDataCache'
import { initSma, addSmaPrice, getSmaArray } from './appMovingAverage'

const buildSmaTradingArray = (symbol, dailyPriceData, smaTradingPeriod) => {
    initSma(smaTradingPeriod, dailyPriceData.length)
    for (let kk = 0; kk < dailyPriceData.length; kk++) {
        addSmaPrice(dailyPriceData[kk].close, dailyPriceData[kk].date)
    }
    let smaArray = getSmaArray() //gets the calculated sma values
    putSmaTradingData(symbol, smaArray) //cache the smaTrading data for subsequent use for chart alerts
}
export default buildSmaTradingArray