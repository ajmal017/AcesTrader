// apploadPriceData.js

import axios from 'axios'
import iexData from '../iex.json'
import { getSandboxStatus } from '../lib/appUseSandboxStatus'
import endOfToday from 'date-fns/endOfToday'
import addHours from 'date-fns/addHours'
var cloneDeep = require('lodash.clonedeep')

export const loadPriceData = async function(state, dispatch, symbols, options) {
  try {
    let pricedata
    const range = iexData.range
    const closeOnly = iexData.closeOnly
    const useSandbox = getSandboxStatus()
    const { updateExisting } = options
    if (updateExisting) {
      pricedata = getSandboxStatus() ? cloneDeep(state.sandboxpricedata) : cloneDeep(state.normalpricedata) // copy existing pricdata object
    } else {
      pricedata = {} // Create a new pricedata object to hold symbol price data
      let newMetaData = endOfToday() // If today is 6 October 2014: endOfToday= Mon Oct 6 2014 23:59:59.999
      newMetaData = addHours(new Date(newMetaData), -6) // adjust time to account for Firebase shifting to Z time, new time= Mon Oct 6 2014 17:59:59.999
      pricedata = { metaKey: newMetaData } // initialize the pricedata metaData property with its key value initialized with today's date
    }
    if (symbols.length > 0) {
      // now get each symbol's price data fron IEX and add into the indexed priceData object
      const BATCH_SIZE = 100
      let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
      for (let i = 0; i < numberOfBatches; i++) {
        let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
        await updateDataFromBatch(symbolsBatch)
      }
    }
    callDispatch(useSandbox) // use priceData object as created or copied

    async function updateDataFromBatch(symbolsBatch) {
      const basehtml = useSandbox ? `${iexData.BasehtmlSandbox}` : `${iexData.BasehtmlCloud}`
      const token = useSandbox ? `token=${iexData.PublishableTestToken}` : `token=${iexData.PublishableToken}`
      const version = iexData.Version
      try {
        // Example of a test batch call that fetches news, 5 year historical prices, and 5 years of splits data for AAPL, GOOG, and FB
        // https://sandbox.iexapis.com/v1/stock/market/batch?types=chart,splits,news&symbols=aapl,goog,fb&range=5y&token=YOUR_TEST_TOKEN_HERE
        const query = closeOnly ? 'chartCloseOnly=true' : 'filter=date,open,high,low,close,volume'
        const requestURL = `${basehtml}${version}/stock/market/batch?types=chart&symbols=${symbolsBatch.join(',')}&range=${range}&${query}&${token}`
        const request = axios.get(requestURL)
        let res = await request
        let values = res.data
        for (let symbol in values) {
          let data = values[symbol]
          if (typeof data !== 'undefined') {
            let thePriceData = data['chart']
            let symbolKey = `${symbol.toUpperCase()}-${range}${closeOnly ? '-CloseOnly' : ''}${useSandbox ? '-Sandbox' : ''}`
            pricedata[symbolKey] = thePriceData // update the pricedata object with a new key & new data which is an array of price series objects
          }
        }
        // do {
        //   console.log(JSON.stringify(pricedata, null, 2)) // a readable log of the state's json
        //   // note: you can Right click > Copy All in the Console panel to copy to clipboard
        // } while (false)
        // debugger
      } catch (error) {
        console.log('apploadPriceData.js error: ' + error.message)
        // alert('apploadPriceData.js error: ' + error.message) //rude interruption to user
        debugger // pause for developer
      }
    }

    function callDispatch(useSandbox) {
      if (useSandbox) {
        // dispatch(replaceSandboxPricedata(pricedata))
        dispatch({
          type: 'REPLACE_SANDBOX_PRICEDATA',
          pricedata: pricedata,
        })
      } else {
        // dispatch(replaceNornalPricedata(pricedata))
        dispatch({
          type: 'REPLACE_NORMAL_PRICEDATA',
          pricedata: pricedata,
        })
      }
    }
  } catch (err) {
    console.log(`loadPriceData() failed. Error=${err.message}`)
    alert(`loadPriceData() failed. Error=${err.message}`)
    debugger
  }
}
