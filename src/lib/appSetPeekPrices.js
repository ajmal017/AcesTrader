// appSetPeekPrices

import axios from 'axios'
import iexData from '../iex.json'
import { getPortfolioSymbols } from './appGetPortfolioSymbols'
import { getSandboxStatus } from '../lib/appUseSandboxStatus'
import { resetPeekPrices, putPeekLastPrice, finishPeekPrices } from './appLastPeekPrice'

export const setPeekPrices = async (state) => {
  resetPeekPrices() //reset the list of prices for new content now

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
      const filters = ['latestPrice', 'change', 'changePercent', 'marketCap']
      const requestURL = `${basehtml}${version}/stock/market/batch?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}&${token}`
      const request = axios.get(requestURL)
      let res = await request
      let values = res.data

      // do {
      //   console.log(JSON.stringify(values, null, 2)) // a readable log of the state's json
      //   // note: you can Right click > Copy All in the Console panel to copy to clipboard
      // } while (false)
      // debugger

      for (let symbol in values) {
        let data = values[symbol]
        if (typeof data !== 'undefined') {
          // putPeekLastPrice() caches the peek prices in a local stash were they are picked up later by a redux thunk
          putPeekLastPrice(symbol, data.quote.latestPrice) //save in the list of prices for use in Charts dashboards
        }
      }
    } catch (error) {
      console.log('appSetPeekPrices.js error:' + error.message)
      // alert('appSetPeekPrices.js error: ' + error.message) //rude interruption to user
      debugger // pause for developer
    }
  }
  finishPeekPrices() //this completes the list of prices for use in Charts dashboards
}
