// appSetDailyPrices.js
import { getDaysDiff } from './appGetDaysDiff'
import { loadPriceData } from './appLoadPriceData'
// import { saveTheNewState } from './appSaveTheState'
import { getSandboxStatus } from '../lib/appUseSandboxStatus'
var cloneDeep = require('lodash.clonedeep')

export const setDailyPrices = async (state, dispatch) => {
  // Use a copied state in this function as it mutates the data
  // This tests the pricedata marker object's date against today's date to ensure that the pricedata will return
  // the correct end-of-day price data for the previous trading day for any symbols that were downloaded already.
  // This reduces IEX costs by not repeating downloads unnecessarily.
  // This fuction returns the found daysOld value for optional use by the caller.
  try {
    // make a working copy of the state.pricedata which will be mutated and then passed to Redux
    let pricedata = getSandboxStatus() ? cloneDeep(state.sandboxpricedata) : cloneDeep(state.normalpricedata)
    // let xstate = cloneDeep(state) // make a working copy of the state to be passed to components that need it
    // let pricedata = cloneDeep(state.pricedata) // make a working copy of the state.pricedata which will be mutated and then passed to Redux
    // debugger //==== BCM =====
    // let priceDataArray // receives the priceData array provided by loadPriceData()
    const date = new Date() // today's date
    const theDay = date.getDay()
    // const expectedMetaData = date // prepare a metaData property value with today's date
    // const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
    // const expectedMetaData = { "date": theDate } // prepare a fresh metaData object with today's date

    // pricedata = { metaKey: null } // BCM reset to empty ======TEST TEST================================

    pricedata = pricedata || { metaKey: null } // Creates a new pricedata object with first keyed item if required
    pricedata.metaKey = pricedata.metaKey || null // get existing metaData date marker if any
    let metaData = pricedata.metaKey // get existing metaData date marker if any
    // debugger //==== BCM =====
    if (!metaData || metaData === undefined) {
      // Established a new pricedata property, the pricedata is empty of any price data

      // BCM do later>> pricedata.metaKey = expectedMetaData // initialize metaKey with a date value for today
      // debugger //==== BCM =====

      // BCM this is new: loadPriceData completes the actions and calls dispatch for redux to update state
      await loadPriceData(state, dispatch, pricedata) // get all the daily price series for portfolio's symbols

      // debugger //pause for dev
      //  saveTheNewState(pricedata, dispatch) // dispatch redux to save the new state back to firebase
      // priceDataArray = await loadPriceData(xstate) // All the daily price series for portfolio's symbols

      return -1 // Established a new state.pricedata loaded with IEX data
    }
    debugger //==== BCM =====
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
    // The current price data is stale, so start fresh now
    // console.log(`Reset symbol database, daysOld=${daysOld}`)

    // BCM do later>> pricedata = { metaKey: expectedMetaData } // Create a new pricedata property with its value initialized with today's date
    // we established a new metaData record, the pricedata is empty of any price data

    // BCM this is new: loadPriceData completes the actions and calls dispatch for redux to update state
    await loadPriceData(state, dispatch, pricedata) // get all the daily price series for portfolio's symbols

    debugger //==== BCM =====
    // priceDataArray = await loadPriceData(xstate) // All the daily price series for portfolio's symbols - Supply the copied state to this function as it mutates the data
    // saveTheNewState(pricedata, dispatch) // dispatch redux to save the new state back to firebase

    return -1 // Established a new metaData record, the pricedata is loaded with IEX data
    //
  } catch (error) {
    console.log('appSetDailyPrices error:', error.message)
    alert('appSetDailyPrices error: ' + error.message) //rude interruption to user
    debugger // pause for developer
  }
}
