// appSetDailyPrices.js
import { getDaysDiff } from './appGetDaysDiff'
import { loadPriceData } from './appLoadPriceData'

export const setDailyPrices = async (state) => {
  // This tests the pricedata marker object's date against today's date
  // to ensure that the pricedata will return the correct
  // end-of-day price data for the previous trading day
  // for any symbols that were downloaded already.
  // This reduces IEX costs by not repeating downloads unnecessarily.
  // This fuction returns the found daysOld value for optional use by the caller.
  try {
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
      await loadPriceData(state) // Add all the daily price series for portfolio's symbols
      // debugger //pause for dev
      return -1 // Established a new metaData record, the pricedata is loaded with IEX data
    }
    // debugger //pause for dev
    // date = new Date(2020, 8, 26) //*********** */TEST TEST TEST****************
    const existingDate = metaData.date // the current date marker
    const daysOld = getDaysDiff(existingDate, date)
    // debugger //******** */TEST TEST TEST**using the fake date created above**************
    if (daysOld === 0) {
      // the existing data is good and has price data downloaded so far today for the prior trading day
      return daysOld // no change, try to get specified symbol from here
    }
    if (daysOld === 1 && theDay === 0) {
      // today is Sunday and data is Friday's end-of-day prices from Saturday's update, so still good.
      // These prices are good and do not need to be downloaded again.
      return daysOld // no change, try to get specified symbol from here
    }
    if ((daysOld === 2 || daysOld === 1) && theDay === 1) {
      // today is Monday and data is Friday's end-of-day prices from Saturday's or Sunday's update, so still good.
      // These prices are good and do not need to be downloaded again.
      return daysOld // no change, try to get specified symbol from here
    }
    // The current price data is stale, so start fresh now
    // console.log(`Reset symbol database, daysOld=${daysOld}`)
    state.pricedata = {} // Create a empty pricedata object
    state.pricedata.metaKey = expectedMetaData // initialize with a date value for today
    // Established a new metaData record, the pricedata is empty of any price data
    await loadPriceData(state) // Add all the daily price series for portfolio's symbols
    return -1 // Established a new metaData record, the pricedata is loaded with IEX data
    //
  } catch (error) {
    console.log('setTheLocalDatabase error:', error.message)
    // alert('setTheLocalDatabase error: ' + error.message) //rude interruption to user
    debugger // pause for developer
  }
}
