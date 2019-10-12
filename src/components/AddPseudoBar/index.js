// AddPseudoBar/index.js

import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import iexData from '../../iex.json'
import { setTheLocalDatabase } from '../../lib/appSetTheLocalDatabase'
import { loadLocalDatabase, saveLocalDatabase, getLocalDatabaseKeys } from '../../lib/localDatabaseStorage'
import WelcomeTrader from '../Welcome/WelcomeTrader'

const AddPseudoBar = () => {
  const [dataReady, setDataReady] = useState({ loading: true, error: false })
  const date = new Date() // today's date
  const theDay = date.getDay() //returns the week day of a date as a number (0-6)
  const theHour = date.getHours() //returns the hours of a date as a number (0-23)

  // const theMinute = date.getMinutes() //returns the minutes of a date as a number (0-59)
  // // useEffect has a missing dependency: 'buildPseudoBars'.
  // // Either include it or remove the dependency array  react-hooks/exhaustive-deps
  // // eslint-disable-next-line
  // useEffect(() => {
  //     buildPseudoBars()
  // }, [theMinute]) // allows a retry after the minute changes

  let allPseudoBars = {} // holds all the constructed pseudobars keyed by symbol
  let errorMessage = null

  const handleClick = (event) => {
    event.preventDefault()
    errorMessage = null
    setDataReady({ loading: false, error: errorMessage })
  }

  const makePseudoBars = async (symbols) => {
    const BATCH_SIZE = 100
    let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
    for (let i = 0; i < numberOfBatches; i++) {
      let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
      await makeBatchOfPseudoBars(symbolsBatch) // the pseudo bars are cached in allPseudoBars[] indexed by symbol
    }
    // This function returns after having filled allPseudoBars[] with a pseudoBar for each symbol
  }

  const makeBatchOfPseudoBars = async (symbols) => {
    const basehtml = `${iexData.BasehtmlCloud}`
    const token = `token=${iexData.PublishableToken}`
    const version = iexData.Version
    const filters = ['latestPrice', 'change', 'changePercent']

    // Use the IEX Quote API to get the latest price:
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
          let fakeDate = date
          let key = symbol
          let pseudoBar = { pseudoBar: true, symbol: symbol, open: fakeOpen, close: fakeClose, high: fakeHigh, low: fakeLow, date: fakeDate, volume: 10000 }
          allPseudoBars[key] = pseudoBar // add this bar to the array
        } else {
          debugger // pause for developer
        }
      }
    } catch (error) {
      console.log('makeBatchOfPseudoBars axios error:' + error.message)
      // alert('makeBatchOfPseudoBars axios error: ' + error.message) //rude interruption to user
      debugger // pause for developer
    }
  }

  const appendPseudoBar = async (symbolKey) => {
    // const result = /(.*)(-.*)/.exec(symbolKey) // extract the symbol from the symbolKey
    const symbol = extractSymbolFromSymbolKey(symbolKey)
    const pseudoBar = allPseudoBars[symbol]
    const symbolData = await loadLocalDatabase(symbolKey) // get price series from the cache

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
    await saveLocalDatabase(symbolKey, symbolData) // save the modified symbol data
    // let testing = await loadLocalDatabase(symbolKey) // test get object back
    // debugger // pause for developer
  }

  const extractSymbolFromSymbolKey = (symbolKey) => {
    let result
    if (/-Sandbox/i.test(symbolKey)) {
      result = /(.*)-.*-.*/.exec(symbolKey) // extract the barebones symbol from a symbolKey having 2 suffixes
    } else {
      result = /(.*)-.*/.exec(symbolKey) // extract the barebones symbol from a symbolKey having 1 suffix
    }
    return result[1] // from array of the extracted barebones symbols.
  }

  const buildPseudoBars = async () => {
    //the local DB contains last trading day symbol price data, returns the DB daysOld number if data exists
    const daysOld = await setTheLocalDatabase(date)
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
    } else {
      // Create fake error to test error handling
      // errorMessage = 'The cache of symbol price data is empty, FAKE FAKE.'
      // setDataReady({ loading: false, error: errorMessage })

      // We need to create an array of symbols of the securities in the local data base cache
      const allKeys = await getLocalDatabaseKeys() // get the keys of objects from the cache
      // remove the MetaKey
      const symbolKeys = allKeys.filter((key) => {
        return key !== 'MetaKey-DateObject'
      })

      // get the bare bones symbols
      const extractedSymbols = symbolKeys.map((symbolKey) => {
        return extractSymbolFromSymbolKey(symbolKey)
      })

      let symbols = extractedSymbols.filter((element, index) => extractedSymbols.indexOf(element) === index) // remove dups

      if (symbols.length === 0) {
        errorMessage = 'The cache of symbol price data is empty, load the charts first.'
        setDataReady({ loading: false, error: errorMessage })
      } else {
        await makePseudoBars(symbols) // use the extracted barebones symbols for IEX queries
        // add pseudo end-of-day bar to each symbol's price series
        symbolKeys.forEach(async (symbolKey) => {
          await appendPseudoBar(symbolKey)
        })
        setDataReady({ loading: false, error: errorMessage }) //finished
      }
    }
  }

  const { loading, error } = dataReady
  const divStyle = { marginTop: 80, marginLeft: 50 }
  if (loading) {
    ;(async function() {
      try {
        await buildPseudoBars()
      } catch (err) {
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

  return <WelcomeTrader /> // return to welcome screen
}

export default AddPseudoBar
