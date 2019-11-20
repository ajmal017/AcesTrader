// appSetDailyPrices.js
import { getDaysDiff } from './appGetDaysDiff'
import { loadPriceData } from './appLoadPriceData'
import { getPortfolioSymbols } from './appGetPortfolioSymbols'
import { getSandboxStatus } from '../lib/appUseSandboxStatus'
// import { getReference } from '../lib/dbReference'
var cloneDeep = require('lodash.clonedeep')

export const setDailyPrices = async (state, dispatch) => {
  // This tests the pricedata marker object's date against today's date to ensure that the pricedata will return
  // the correct end-of-day price data for the previous trading day for any symbols that were downloaded already.
  // This reduces IEX costs by not repeating downloads unnecessarily.
  // This function returns the found daysOld value for optional use by the caller, unless the data needs to be reloaded.
  try {
    // // BCM TEST TEST TEST ============================================================================================
    // let testSandbox = getSandboxStatus()
    // if (testSandbox) {
    //   dispatch({ type: 'REMOVE_SANDBOX_PRICEDATA' })
    //   debugger
    //   return 0 //dummy days old
    // } else {
    //   // await loadPriceData(state, dispatch) // get all the normal daily price series for portfolio's symbols
    //   // dispatch({ type: 'REMOVE_NORMAL_PRICEDATA' })
    // }
    // // BCM TEST TEST TEST ============================================================================================

    // make a copy of the state.pricedata
    let pricedata = getSandboxStatus() ? cloneDeep(state.sandboxpricedata) : cloneDeep(state.normalpricedata)
    // const symbolType = getSandboxStatus() ? 'sandbox' : 'normal'
    const date = new Date() // today's date
    const theDay = date.getDay()
    // const expectedMetaData = date // prepare a metaData property value with today's date
    // const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
    // const expectedMetaData = { "date": theDate } // prepare a fresh metaData object with today's date

    // pricedata = { metaKey: null } // BCM reset to empty ======TEST TEST================================

    pricedata = pricedata || { metaKey: null } // Creates a new pricedata object with first keyed item if no existing object
    pricedata['metaKey'] = pricedata['metaKey'] || null // get existing metaData date marker if any
    let metaData = pricedata['metaKey'] // get existing metaData date marker if any
    // debugger //==== BCM =====
    if (!metaData || metaData === undefined) {
      // We need to create a new pricedata property, this pricedata is empty of any price data
      // This loadPriceData creates the object and calls dispatch for redux to update state
      // console.log(`metaData=null: calling LoadPriceData for ${getReference()} ${symbolType}`)
      await loadPriceData(state, dispatch, getPortfolioSymbols(state), { updateExisting: false }) // build new collection of daily price series for portfolio's symbols
      return -1 // Established a new state.pricedata loaded with IEX data
    }
    // date = new Date(2020, 8, 26) //*********** */TEST TEST TEST****************
    const existingDate = pricedata.metaKey // the current date marker
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
    // console.log(`Reset symbol database, daysOld=${daysOld}`)
    // We need to create a new pricedata property, this current price data is stale
    // This loadPriceData creates the object and calls dispatch for redux to update state
    // console.log(`metaData.date=stale: calling LoadPriceData for ${getReference()} ${symbolType}`)
    await loadPriceData(state, dispatch, getPortfolioSymbols(state), { updateExisting: false }) // build new collection of daily price series for portfolio's symbols

    // debugger //==== BCM =====

    return -1 // Established a new metaData record, the pricedata is loaded with IEX data
    //
  } catch (error) {
    console.log('appSetDailyPrices error:', error.message)
    alert('appSetDailyPrices error: ' + error.message) //rude interruption to user
    debugger // pause for developer
  }
}
