//appBuildPseudobar.js

import axios from 'axios'
import iexData from '../iex.json'
import { setDailyPrices } from './appSetDailyPrices'
import { getSandboxStatus } from './appUseSandboxStatus'
import { getTheDateAsString } from '../lib/appGetTheDateAsString'
// import replaceSandboxPricedata from '../redux/reducerSandboxPriceData'
// import replaceNormalPricedata from '../redux/reducerNormalPriceData'
var cloneDeep = require('lodash.clonedeep')

export const buildPseudoBar = async (state, dispatch) => {
  const date = new Date() // today's date
  const pseudoDate = getTheDateAsString() // current date as string
  let allPseudoBars = {} // holds all the constructed pseudobars keyed by symbol
  let errorMessage = null
  // NOTE: PseudoBars are saved to app state, so old ones show when app is opened later. Select "Add PseudoBar" to update

  // If not correct circumstances then return with message
  const theDay = date.getDay() //returns the week day of a date as a number (0-6)
  const theHour = date.getHours() //returns the hours of a date as a number (0-23)
  const daysOld = await setDailyPrices(state, dispatch) //this returns the daysOld number since data exists at this stage
  if (theDay === 6 || theDay === 0) {
    // Today is Saturday or Sunday, all price series have correct last trading day bar
    errorMessage = 'Today is a weekend, all price series have correct last day trading bar'
    return errorMessage //<===EXIT===
  } else if (theHour < 10) {
    // The market is just open at 9:30, we only append pseudo bars after 10
    errorMessage = 'Too early, delayed quotes are used to build pseudo bars half-hour after market open'
    return errorMessage //<===EXIT===
  } else if (daysOld === -1) {
    errorMessage = 'The cache of symbol price data is empty, load the charts first.'
    return errorMessage //<===EXIT===
  }

  let pricedata = getSandboxStatus() ? cloneDeep(state.sandboxpricedata) : cloneDeep(state.normalpricedata)

  // We need to create an array of symbols of the securities in this portfolio's pricedata
  const allKeys = Object.keys(pricedata) // get the keys (symbols) of the pricedata object
  // remove the MetaKey object item
  const symbolKeys = allKeys.filter((key) => {
    return key !== 'metaKey'
  })

  const extractSymbolFromSymbolKey = (symbolKey) => {
    // symbolKey is the symbol with one or more suffixes each with a "-" as first character
    let thePossibleSymbol = symbolKey //initial value
    let result
    do {
      result = /(.*)-.*/.exec(thePossibleSymbol) // remove one suffix to extract the symbol
      thePossibleSymbol = result[1]
    } while (/-/.test(thePossibleSymbol) === true) //another suffix remains
    return result[1] // the extracted barebones symbol.
  }

  const extractedSymbols = symbolKeys.map((symbolKey) => {
    // remove suffixes to get the bare bones symbol
    return extractSymbolFromSymbolKey(symbolKey)
  })
  let symbols = extractedSymbols.filter((element, index) => extractedSymbols.indexOf(element) === index) // remove dups if same symbol was present with different symbolKey suffixes
  if (symbols.length === 0) {
    errorMessage = 'The cache of symbol price data is empty, load the charts first.'
    return errorMessage //<===EXIT===
  }

  const makePseudoBars = async (symbols) => {
    // This function returns after having filled the allPseudoBars indexed objectwith a pseudoBar for each symbol
    const BATCH_SIZE = 100
    let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
    // console.log(`IEX BuildPseudoBar numberOfBatches=${numberOfBatches}`) // BCM IEX
    for (let i = 0; i < numberOfBatches; i++) {
      let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
      await makeBatchOfPseudoBars(symbolsBatch) // the pseudo bars are put in allPseudoBars indexed by symbol
    }
  }

  const makeBatchOfPseudoBars = async (symbols) => {
    const basehtml = `${iexData.BasehtmlCloud}`
    const token = `token=${iexData.PublishableToken}`
    const version = iexData.Version
    const filters = ['latestPrice', 'change', 'changePercent']

    // Use the IEX Quote API to get the latest price. IEX describes the logic as follows:
    // Refers to the latest relevant price of the security which is derived from multiple sources.
    // We first look for an IEX real time price.If an IEX real time price is older than 15 minutes,
    // 15 minute delayed market price is used.If a 15 minute delayed price is not available,
    // we will use the current day close price.If a current day close price is not available,
    // we will use the last available closing price(listed below as previousClose)
    // IEX real time price represents trades on IEX only.Trades occur across over a dozen exchanges,
    // so the last IEX price can be used to indicate the overall market price.
    // 15 minute delayed prices are from all markets using the Consolidated Tape.
    // NOTE: This will not include pre or post market prices.

    // console.log(`IEX BuildPseudoBar batch size=${symbols.length}`) // BCM IEX
    const request = axios.get(`${basehtml}${version}/stock/market/batch?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}&${token}`)
    let res = await request
    let values = res.data
    for (let symbol in values) {
      let data = values[symbol]
      if (typeof data !== 'undefined') {
        let fakeClose = data.quote.latestPrice
        let fakeChange = fakeClose * 0.004
        let fakeOpen = fakeClose + fakeChange
        let fakeHigh = fakeOpen + fakeChange
        let fakeLow = fakeClose - fakeChange
        let fakeDate = pseudoDate
        let pseudoBar = { pseudoBar: true, symbol: symbol, open: fakeOpen, close: fakeClose, high: fakeHigh, low: fakeLow, date: fakeDate, volume: 10000 }
        allPseudoBars[symbol] = pseudoBar // add this pseudoBar obj to the indexed object
      } else {
        debugger // pause for developer
      }
    }
  }

  const appendPseudoBar = (symbolKey) => {
    // get one of the prepared pseudoBars and append it to end of the price series array
    const symbol = extractSymbolFromSymbolKey(symbolKey)
    const pseudoBar = allPseudoBars[symbol] // the symbol's pseudobar obj
    const symbolData = pricedata[symbolKey] // the price series array from the state pricedata object
    let currentLastBar = symbolData[symbolData.length - 1]
    // Hack to workaround leftover bad bar. This problem discovered Monday 5/20/19, after weekend of testing AddPseudoBar
    if (currentLastBar === undefined) {
      symbolData.pop() // undefined array element result of testing AddPseudoBar?
      currentLastBar = symbolData[symbolData.length - 1] // get the new last bar
    }
    if (currentLastBar.pseudoBar) {
      symbolData.pop() // remove last created pseudoBar
    }
    symbolData.push(pseudoBar) // add the newly created pseudoBar
    pricedata[symbolKey] = symbolData // update the modified price series in the state
  }

  await makePseudoBars(symbols) // use the extracted barebones symbols for IEX queries
  // add pseudo end-of-day bar to each symbol's price series
  symbolKeys.forEach(async (symbolKey) => {
    appendPseudoBar(symbolKey)
  })

  if (!errorMessage) {
    // finished without error
    if (getSandboxStatus()) {
      // dispatch(replaceSandboxPricedata(pricedata))
      dispatch({
        type: 'REPLACE_SANDBOX_PRICEDATA',
        pricedata: pricedata,
      })
    } else {
      // dispatch(replaceNormalPricedata(pricedata))
      dispatch({
        type: 'REPLACE_NORMAL_PRICEDATA',
        pricedata: pricedata,
      })
    }
  }

  return null //<===NORMAL EXIT=== No errorMessage
}
