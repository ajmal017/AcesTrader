// appLoadWatchedPrices.js

import axios from 'axios'
import iexData from '../iex.json'
import { putWatchedPrice, finishWatchedPrices, resetWatchedPrices } from '../lib/appWatchedPrice'

export const loadWatchedPrices = async function (symbols) {

  // const useSandbox = true // use this when testing logic
  const useSandbox = false
  const basehtml = useSandbox ? `${iexData.BasehtmlSandbox}` : `${iexData.BasehtmlCloud}`
  const version = iexData.Version
  const token = useSandbox ? `token=${iexData.PublishableTestToken}` : `token=${iexData.PublishableToken}`
  const filters = ['latestPrice']
  // const filters = ['latestPrice', 'change', 'changePercent', 'marketCap']
  try {
    resetWatchedPrices() //reset the list of prices for use in Charts dashboards
    const request = axios
      .get(`${basehtml}${version}/stock/market/batch?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}&${token}`)
    let res = await request
    let values = res.data
    for (let symbol in values) {
      let data = values[symbol]
      if (typeof data !== 'undefined') {
        putWatchedPrice(symbol, data.quote.latestPrice) //save in the list of prices for use in Charts dashboards
      } else {
        debugger //pause for developer
      }
    }
    finishWatchedPrices() //this is the complete list of prices for use in Charts dashboards

  } catch (error) {
    console.log('loadWatchedPrices axios error:' + error.message)
    // alert('loadWatchedPrices axios error: ' + error.message) //rude interruption to user
    debugger // pause for developer
  }
}
