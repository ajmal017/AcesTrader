// appGetSymbolPriceData.js

import iexData from '../iex.json'
import { getIEXData } from '../lib/apiGetIEXData'
import { getSandboxStatus } from '../lib/appUseSandboxStatus'
import { setDailyPrices } from '../lib/appSetDailyPrices'
let cloneDeep = require('lodash.clonedeep')

export const getSymbolPriceData = async function(symbol, state, dispatch) {
  const range = iexData.range //default value
  const closeOnly = iexData.closeOnly //default value
  const useSandbox = getSandboxStatus()

  // Allow for different versions of the symbol's price file
  const symbolKey = `${symbol.toUpperCase()}-${range}${closeOnly ? '-CloseOnly' : ''}${useSandbox ? '-Sandbox' : ''}`
  // console.log('getSymbolPriceData for: ' + symbolKey)
  try {
    await setDailyPrices(state, dispatch) // Ensures the daily prices will contain the last trading day price data
    // Note: the price data is refreshed each day with last day prices from yesterday
    // Get the price series from the pricedata object if available
    let pricedata = getSandboxStatus() ? 'sandboxpricedata' : 'normalpricedata'
    let symbolData = state[pricedata][symbolKey] // get the symbol's price data
    if (symbolData && symbolData.length > 0) {
      // console.log(`Found: ${symbolKey}, Keys: ${await getLocalDatabaseKeys()}`)
      // console.log(`Found: ${symbolKey}`)
      // symbol price data is available for yesterday's end-of-day prices
      // this data may also have a constructed pseudo daily bar for today's prices

      // Hack to workaround leftover bad bar. This bug discovered 5/20/19, Monday after weekend of testing AddPseudoBar
      let currentLastBar = symbolData[symbolData.length - 1] // get the last bar
      if (currentLastBar === undefined) {
        symbolData.pop() // undefined array element result of testing AddPseudoBar
      }

      let values = cloneDeep(symbolData)
      // format the dates for the required charting format
      let data = values.map((obj) => {
        let date = obj.date
        date = date + 'T15:00:00.000Z'
        obj.date = new Date(date)
        return obj
      })
      return data // return price series from app state.
    } else {
      // console.log(`****Missing: ${symbolKey}`)
      console.log('appGetSymbolPriceData - Unexpected missing price data in app state: ' + symbolKey)
      alert('appGetSymbolPriceData - Unexpected missing price data in app state: ' + symbolKey) //rude interruption to user

      // Download the end-of-day price series for yesterday from IEX cloud if not in our cache
      let symbolData = await downloadSymbolData(symbol, range, closeOnly, useSandbox)

      // Note we do not call dispatch here to have redux add this solo price data object to pricedata,
      // because the Edit component which adds new symbols includes downstream logic which groups the symbols
      // and calls appLoadPriceData do a batch download from IEX and update the priceData app state slice.
      return symbolData // return price series that was found in our cache
    }
  } catch (err) {
    console.log(`getSymbolPriceData(${symbolKey}) failed. Error=${err.message}`)
    alert(`getSymbolPriceData(${symbolKey}) failed. Error=${err.message}`)
    debugger
  }
}

const downloadSymbolData = async function(symbol, range, closeOnly, useSandbox) {
  // get the symbol price series data from the IEX cloud
  let data = getIEXData(symbol, range, closeOnly, useSandbox)
  try {
    let symbolData = await data
    return symbolData
  } catch (err) {
    alert(`getIEXData(${symbol}) failed in getSymbolPriceData. Error=${err.message}`)
    debugger
  }
}
