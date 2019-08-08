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


    const buildPseudoBars = async () => {
        const { loading } = dataReady
        if (theDay === 6 || theDay === 0) {
            // Today is Saturday or Sunday, all price series have correct last trading day bar
            setDataReady({ loading: false, error: 'Today is a weekend, all price series have correct last day trading bar' })
        } else if (theHour < 10) {
            // The market is just open at 9:30, we only append pseudo bars after 10
            setDataReady({ loading: false, error: 'Too early, delayed quotes are used to build pseudo bars half-hour after market open' })
        } else if (loading) {
            // We need to create an array of symbols of the securities in the local data base cache
            const daysOld = await setTheLocalDatabase(date) //the local DB contains last trading day symbol price data, returns the DB daysOld number if data exists
            if (daysOld === -1) {
                setDataReady({ loading: false, error: 'The cache of symbol price data is empty, load the charts first.' })
            } else {
                const allKeys = await getLocalDatabaseKeys() // get the keys of objects from the cache
                const symbolKeys = allKeys.filter((key) => { return (key !== 'MetaKey-DateObject') }) //remove the MetaKey
                const extractedSymbols = symbolKeys.map((symbolKey) => {
                    let result = /(.*)(-.*)/.exec(symbolKey) // extract the barebones symbol from the symbolKey
                    return result[1] // make array of the extracted barebones symbols.
                })
                let symbols = extractedSymbols.filter((element, index) => extractedSymbols.indexOf(element) === index) // remove dups
                await makePseudoBars(symbols) // use the extracted barebones symbol
                symbolKeys.forEach((symbolKey) => { appendPseudoBar(symbolKey) }) // add pseudo end-of-day bar to each symbol's price series
                setDataReady({ loading: false, error: false })
            }
        }
    }

    buildPseudoBars()

    const makePseudoBars = async (symbols) => {
        const BATCH_SIZE = 100
        let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
        // debugger
        for (let i = 0; i < numberOfBatches; i++) {
            let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
            await makeBatchOfPseudoBars(symbolsBatch) // the pseudo bars are cached in allPseudoBars indexed by symbol
        }
        // debugger
    }

    let allPseudoBars = {} // keyed by symbols

    const makeBatchOfPseudoBars = async (symbols) => {
        const basehtml = `${iexData.BasehtmlCloud}`
        const token = `token=${iexData.PublishableToken}`
        const version = iexData.Version
        const filters = ['latestPrice', 'change', 'changePercent']

        // console.log(`### AddPseudoBar ###`)
        // debugger // pause for developer
        try {
            const request = axios
                .get(`${basehtml}${version}/stock/market/batch?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}&${token}`)
            let res = await request
            let values = res.data
            for (let symbol in values) {
                let data = values[symbol]
                if (typeof data !== 'undefined') {
                    // debugger
                    let fakeClose = data.quote.latestPrice
                    let fakeChange = fakeClose * 0.003
                    let fakeOpen = fakeClose + fakeChange
                    let fakeHigh = fakeOpen + fakeChange
                    let fakeLow = fakeClose - fakeChange
                    let fakeDate = date
                    let key = symbol
                    let pseudoBar = { pseudoBar: true, symbol: symbol, open: fakeOpen, close: fakeClose, high: fakeHigh, low: fakeLow, date: fakeDate, volume: 10000 }
                    allPseudoBars[key] = pseudoBar
                }
            }

        } catch (error) {
            console.log('makeBatchOfPseudoBars axios error:' + error.message)
            // alert('makeBatchOfPseudoBars axios error: ' + error.message) //rude interruption to user
            debugger // pause for developer
        }
    }

    const appendPseudoBar = async (symbolKey) => {
        const result = /(.*)(-.*)/.exec(symbolKey) // extract the symbol from the symbolKey
        const symbol = result[1]
        const pseudoBar = allPseudoBars[symbol]
        const symbolData = await loadLocalDatabase(symbolKey) // get price series from the cache
        let currentLastBar = symbolData[symbolData.length - 1]

        // BCM Hack to workaround leftover bad bar. This bug discovered 5/20/19, Monday after weekend of testing AddPseudoBar
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
        // debugger
    }

    const handleClick = (event) => {
        event.preventDefault()
        setDataReady({ loading: false, error: false })
    }

    const { loading, error } = dataReady
    const divStyle = { marginTop: 80, marginLeft: 50 }

    if (loading) {
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
    return <WelcomeTrader /> // return to start screen
}



export default AddPseudoBar
