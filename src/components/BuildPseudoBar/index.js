// BuildPseudoBar/index.js

import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import iexData from '../../iex.json'
import { setDailyPrices } from '../../lib/appSetDailyPrices'
import { getSandboxStatus } from '../../lib/appUseSandboxStatus'
import WelcomeTrader from '../Welcome/WelcomeTrader'
var cloneDeep = require('lodash.clonedeep')

export const BuildPseudoBar = (props) => {
  const [dataReady, setDataReady] = useState({ loading: true, error: false })
  const state = props.state
  const dispatch = props.dispatch
  const date = new Date() // today's date
  const nowYear = date.getFullYear()
  const nowMonth = date.getMonth() + 1
  const nowDay = date.getDate()
  const pseudoDate = `${nowYear}-${nowMonth}-${nowDay}` // today's date
  let allPseudoBars = {} // holds all the constructed pseudobars keyed by symbol
  let errorMessage = null
  // NOTE: PseudoBars are saved to app state, so old ones show when app is opened later. Select "Add PseudoBar" to update
  let pricedata = getSandboxStatus() ? cloneDeep(state.sandboxpricedata) : cloneDeep(state.normalpricedata)

  // Test if correct circumstances else return error
  const theDay = date.getDay() //returns the week day of a date as a number (0-6)
  const theHour = date.getHours() //returns the hours of a date as a number (0-23)
  const daysOld = setDailyPrices(state, dispatch) //this returns the daysOld number since data exists at this stage
  if (theDay === 6 || theDay === 0) {
    // Today is Saturday or Sunday, all price series have correct last trading day bar
    errorMessage = 'Today is a weekend, all price series have correct last day trading bar'
    setDataReady({ loading: false, error: errorMessage })
  } else if (theHour < 10) {
    // The market is just open at 9:30, we only append pseudo bars after 10
    errorMessage = 'Too early, delayed quotes are used to build pseudo bars half-hour after market open'
    setDataReady({ loading: false, error: errorMessage })
  } else if (daysOld === -1) {
    errorMessage = 'The cache of symbol price data is empty, load the charts first.'
    setDataReady({ loading: false, error: errorMessage })
    // } else {
    // Create fake error to test error handling
    // errorMessage = 'The cache of symbol price data is empty, FAKE FAKE.'
    // setDataReady({ loading: false, error: errorMessage })
  }

  const handleClick = (event) => {
    event.preventDefault()
    errorMessage = null
    setDataReady({ loading: false, error: errorMessage })
  }

  const makePseudoBars = async (symbols) => {
    // This function returns after having filled allPseudoBars with a pseudoBar for each symbol
    const BATCH_SIZE = 100
    let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
    for (let i = 0; i < numberOfBatches; i++) {
      let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
      debugger // BCM
      await makeBatchOfPseudoBars(symbolsBatch) // the pseudo bars are put in allPseudoBars indexed by symbol
      debugger // BCM
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
    try {
      // console.log(`IEX BuildPseudoBar`) // BCM IEX
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
    } catch (error) {
      console.log('makeBatchOfPseudoBars axios error:' + error.message)
      alert('makeBatchOfPseudoBars axios error: ' + error.message) //rude interruption to user
      debugger // pause for developer
    }
  }

  const appendPseudoBar = async (symbolKey) => {
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
      symbolData.pop() // remove the last created pseudoBar
    }
    symbolData.push(pseudoBar) // add the newly created pseudoBar
    pricedata[symbolKey] = symbolData // update the modified price series in the state
    // let testing = pricedata[symbolKey] // test getting object back
    // debugger // pause for developer
  }

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

  const buildPseudoBars = async () => {
    // We need to create an array of symbols of the securities in the local data base cache
    const allKeys = Object.keys(pricedata) // get the keys (symbols) of the pricedata object
    // remove the MetaKey
    const symbolKeys = allKeys.filter((key) => {
      return key !== 'metaKey'
    })

    // get the bare bones symbols
    const extractedSymbols = symbolKeys.map((symbolKey) => {
      return extractSymbolFromSymbolKey(symbolKey)
    })

    let symbols = extractedSymbols.filter((element, index) => extractedSymbols.indexOf(element) === index) // remove dups if same symbol was present with different symbolKey suffixes
    debugger // BCM

    if (symbols.length === 0) {
      errorMessage = 'The cache of symbol price data is empty, load the charts first.'
      setDataReady({ loading: false, error: errorMessage })
    } else {
      await makePseudoBars(symbols) // use the extracted barebones symbols for IEX queries
      debugger // BCM
      // add pseudo end-of-day bar to each symbol's price series
      symbolKeys.forEach(async (symbolKey) => {
        await appendPseudoBar(symbolKey)
      })
      debugger // BCM
      if (!errorMessage) {
        // finished with no error
        if (getSandboxStatus()) {
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
      setDataReady({ loading: false, error: errorMessage }) //finished
    }
  }

  const { loading, error } = dataReady
  const divStyle = { marginTop: 80, marginLeft: 50 }
  if (loading) {
    ;(async function() {
      try {
        await buildPseudoBars()
      } catch (err) {
        console.log('BuildPseudoBar error:', error.message)
        alert('BuildPseudoBar error: ' + error.message) //rude interruption to user
        debugger // pause for developer
      }
    })()
    return (
      <div style={divStyle}>
        <h4>{'Working, please wait...'}</h4>
      </div>
    )
  }
  if (error) {
    return (
      <div style={divStyle}>
        <h4>{`${error}`}</h4>
        <p>
          <button onClick={handleClick}> OK </button>
        </p>
      </div>
    )
  }
  return <WelcomeTrader /> // exit to welcome screen
}
