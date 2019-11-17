// apiGetIEXBatchData.js

import axios from 'axios'
import iexData from '../iex.json'
import { getPortfolioSymbols } from './appGetPortfolioSymbols'
import { getSandboxStatus } from '../lib/appUseSandboxStatus'
import { putPeekLastPrice } from './appLastPeekPrice'

export const getIEXBatchData = async (state, options) => {
  // Supply the copied state to this function when options.priceData===true as it mutates the data
  // Get batched symbol data and apply as per input's options parameter
  const { peekData, priceData } = options
  const range = iexData.range
  const closeOnly = iexData.closeOnly
  const useSandbox = getSandboxStatus()
  // const useSandbox = process.env.NODE_ENV === 'development' ? true : false // development gets junk ohlc values to test with, but free downloads.
  const BATCH_SIZE = 100
  const symbols = getPortfolioSymbols(state) // all the Buys, Longs, Shorts, etc...
  let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
  for (let i = 0; i < numberOfBatches; i++) {
    let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
    await updateDataForBatch(symbolsBatch)
  }

  async function updateDataForBatch(symbols) {
    const basehtml = useSandbox ? `${iexData.BasehtmlSandbox}` : `${iexData.BasehtmlCloud}`
    const token = useSandbox ? `token=${iexData.PublishableTestToken}` : `token=${iexData.PublishableToken}`
    const version = iexData.Version
    try {
      if (peekData) {
        const filters = ['latestPrice', 'change', 'changePercent', 'marketCap']
        const requestURL = `${basehtml}${version}/stock/market/batch?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}&${token}`
        const request = axios.get(requestURL)
        let res = await request
        let values = res.data
        for (let symbol in values) {
          let data = values[symbol]
          if (typeof data !== 'undefined') {
            // putPeekLastPrice() caches the peek prices in a local stash were they are picked up later by a redux thunk
            putPeekLastPrice(symbol, data.quote.latestPrice) //save in the list of prices for use in Charts dashboards
          }
        }
        return true // resolve promise
      } else if (priceData) {
        // Example of a test batch call that fetches news, 5 year historical prices, and 5 years of splits data for AAPL, GOOG, and FB
        // https://sandbox.iexapis.com/v1/stock/market/batch?types=chart,splits,news&symbols=aapl,goog,fb&range=5y&token=YOUR_TEST_TOKEN_HERE
        const query = closeOnly ? 'chartCloseOnly=true' : 'filter=date,open,high,low,close,volume'
        const requestURL = `${basehtml}${version}/stock/market/batch?types=chart&symbols=${symbols.join(',')}&range=${range}&${query}&${token}`
        const request = axios.get(requestURL)
        let res = await request
        let values = res.data
        let pricedata = {} // start an empty object
        for (let symbol in values) {
          let data = values[symbol]
          if (typeof data !== 'undefined') {
            let thePriceData = data['chart']
            let symbolKey = `${symbol.toUpperCase()}-${range}${closeOnly ? '-CloseOnly' : ''}${useSandbox ? '-Sandbox' : ''}`
            pricedata[symbolKey] = thePriceData // update app state's pricedata object with a new key & new data which is an array of price series objects
          }
        }

        // do {
        //   console.log(JSON.stringify(pricedata, null, 2)) // a readable log of the state's json
        //   // note: you can Right click > Copy All in the Console panel to copy to clipboard
        // } while (false) // BCM BCM
        // debugger // BCM ====

        return pricedata // resolve promise
      } else {
        alert('Missing options parameter in getIEXBatchData')
        debugger // pause for developer
      }
    } catch (error) {
      console.log('appSetPeekPrices.js axios error:' + error.message)
      // alert('Peek/index.js axios error: ' + error.message) //rude interruption to user
      debugger // pause for developer
    }
  }
}
