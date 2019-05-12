// appGetDailyPriceChart.js

import { getDailyPriceData } from './chartDataCache'
import { getSmaTradingData } from './chartDataCache'
// import { getSma200Data } from './chartDataCache'

export const getDailyPriceChart = (symbol) => {
  const dailyData = getDailyPriceData(symbol) // get daily values for the symbol
  const sma = getSmaTradingData(symbol) // getSma200Data(symbol)
  const firstSmaDate = sma[0].date
  const testDate1 = `${firstSmaDate.getFullYear()}${firstSmaDate.getMonth() + 1}${firstSmaDate.getDate()}`
  // find the data array index with the same date as the first sma object
  const matchingIndex = dailyData.findIndex((obj, index) => {
    let testDate2 = `${obj.date.getFullYear()}${obj.date.getMonth() + 1}${obj.date.getDate()}`
    return testDate1 === testDate2
  })
  // adjust dailyData starting date to match first available Sma data for testing the daily trading
  const data = dailyData.slice(matchingIndex)
  return data
}
