// appSetDailyPrices.js
import { getPortfolioSymbols } from './appGetPortfolioSymbols'
import { getDaysDiff } from './appGetDaysDiff'

export const setDailyPrices = async (state) => {
  // This tests the pricedata marker object's date against today's date
  // to ensure that the pricedata will return the correct
  // end-of-day price data for the previous trading day
  // for any symbols that were downloaded already.
  // This reduces IEX costs by not repeating downloads unnecessarily.
  // This fuction returns the found daysOld value for optional use by the caller.
  const metaKey = 'metaKey-dailyprices'
  const date = new Date() // today's date
  const theDay = date.getDay()
  const expectedMetaData = { date: date } // prepare a metaData object with today's date
  // const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
  // const expectedMetaData = { "date": theDate } // prepare a fresh metaData object with today's date

  state.pricedata = state.pricedata || {} // Create a new pricedata object when required
  let metaData = state.pricedata.metaKey // get existing metaData date marker if any
  if (!metaData || metaData === undefined) {
    state.pricedata.metaKey = expectedMetaData // initialize with a date value for today

    // Established a new metaData record, the pricedata is empty of any price data
    // Add the default daily price series for portfolio
    const symbols = getPortfolioSymbols(state) // collect all the symbols in currently loaded portfolio
    const item = symbols[0] //temp testing

    debugger //pause for dev
    return -1 // Established a new metaData record, the pricedata is loaded with IEX data
  }
  debugger //pause for dev

  //
  //

  debugger //pause for dev
  return null
}
