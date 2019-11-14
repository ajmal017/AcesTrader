// apiGetIEXBatchData.js

import axios from 'axios'
import iexData from '../iex.json'
import { getPortfolioSymbols } from './appGetPortfolioSymbols'
import { getSandboxStatus } from '../lib/appUseSandboxStatus'

export const getIEXBatchData = async (state, options) => {
  // Get batched symbol data and apply as per input's options parameter
  const { peekData, priceData } = options
  const range = iexData.range
  const closeOnly = iex.closeOnly
  const useSandbox = getSandboxStatus()
  // const useSandbox = process.env.NODE_ENV === 'development' ? true : false // development gets junk ohlc values to test with, but free downloads.
  const BATCH_SIZE = 100
  const symbols = getPortfolioSymbols(state)
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
            putPeekLastPrice(symbol, data.quote.latestPrice) //save in the list of prices for use in Charts dashboards
          }
        }
        return true // resolve promise
      } else if (priceData) {
        const query = closeOnly ? 'chartCloseOnly=true' : 'filter=date,open,high,low,close,volume'
        const requestURL = `${basehtml}${version}/stock/market/batch?types=chart &symbols=${symbols.join(',')}&range=${range}${query}&${token}`
        const request = axios.get(requestURL)
        let res = await request
        let values = res.data
        for (let symbol in values) {
          let data = values[symbol]
          if (typeof data !== 'undefined') {
            let symbolKey = `${symbol.toUpperCase()}-${range}${closeOnly ? '-CloseOnly' : ''}${useSandbox ? '-Sandbox' : ''}`
            state.pricedata[symbolKey] = data // update app state
          }
        }
        saveTheNewState(state) // save the new state back in firebase
        return true // resolve promise
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
