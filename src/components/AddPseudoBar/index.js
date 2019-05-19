// AddPseudoBar/index.js

import React, { Component } from 'react'
import { useState, useEffect } from 'react'
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
    const theMinute = date.getMinutes() //returns the minutes of a date as a number (0-59)

    useEffect(() => {
        buildPseudoBars()
    }, [theMinute]) // allows a retry after the minute changes

    const buildPseudoBars = async () => {
        const { loading, error } = dataReady
        // if (theDay === 6 || theDay === 0) {
        //     // Today is Saturday or Sunday, all price series have correct last trading day bar
        //     setDataReady({ loading: false, error: 'Today is a weekend, all price series have correct last day trading bar' })
        // } else if (theHour < 10) {
        //     // The market is just open, we only append pseudo bars after 10
        //     setDataReady({ loading: false, error: 'Too early, delayed quotes are used to build pseudo bars after 10am' })

        if (false) { // <***** BCM ************* temp to replace tests above

        } else if (loading) {
            const daysOld = await setTheLocalDatabase(date) //the local DB contains last trading day symbol price data, returns the DB daysOld number
            const allKeys = await getLocalDatabaseKeys() // get the keys of objects from the cache
            const symbolKeys = allKeys.filter((key) => { return (key !== 'MetaKey-DateObject') })
            const extractedSymbols = symbolKeys.map((symbolKey) => {
                let result = /(.*)(-.*)/.exec(symbolKey) // extract the symbol from the symbolKey
                return result[1] // make array of the extracted symbols.
            })
            let symbols = extractedSymbols.filter((element, index) => extractedSymbols.indexOf(element) === index) // remove dups
            await makePseudoBars(symbols)


            // keys.forEach((symbolKey) => { appendPseudoBar(symbolKey) }) // add pseudo end-of-day bar to each symbol's price series
            // appendPseudoBar(keys[0]) // test logic with first symbol only
            // debugger

            setDataReady({ loading: false, error: false })
        }
    }

    const makePseudoBars = async (symbols) => {
        const BATCH_SIZE = 100
        let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
        debugger
        for (let i = 0; i < numberOfBatches; i++) {
            let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
            await makeBatchOfPseudoBars(symbolsBatch)
        }
        debugger
    }

    let allPseudoBars = {} // keyed by symbols

    const makeBatchOfPseudoBars = async (symbols) => {
        const basehtml = `${iexData.BasehtmlCloud}`
        const token = `token=${iexData.PublishableToken}`
        const version = iexData.Version
        try {
            const request = axios
                .get(`${basehtml}${version}/stock/market/batch?types=delayed-quote&symbols=${symbols.join(',')}&${token}`)
            let res = await request
            let valueKeys = Object.keys(res.data)
            debugger
            for (let i = 0; i < valueKeys.length; i++) {
                let quoteData = res.data[valueKeys[i]]['delayed-quote']
                // debugger
                let fakeOpen = Math.round((quoteData.high + quoteData.low) / 2)
                let fakeClose = quoteData.delayedPrice
                let fakeHigh = quoteData.high
                let fakeLow = quoteData.low
                let fakeDate = quoteData.processedTime
                let symbol = quoteData.symbol
                let pseudoBar = { pseudoBar: true, symbol: symbol, open: fakeOpen, close: fakeClose, high: fakeHigh, low: fakeLow, date: fakeDate, volume: 10000 }
                allPseudoBars[symbol] = pseudoBar
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
        const symbolData = await loadLocalDatabase(symbolKey) // get price series from the cache
        const currentLastBar = symbolData[symbolData.length - 1]
        const quoteData = await downloadSymbolQuote(symbol)
        const fakeOpen = Math.round((quoteData.high + quoteData.low) / 2)
        const fakeClose = quoteData.delayedPrice
        const fakeHigh = quoteData.high
        const fakeLow = quoteData.low
        const fakeDate = quoteData.processedTime
        const pseudoBar = { pseudoBar: true, open: fakeOpen, close: fakeClose, high: fakeHigh, low: fakeLow, date: fakeDate, volume: 10000 }
        if (currentLastBar.pseudoBar) {
            symbolData.pop()
        }
        symbolData.push(pseudoBar)
        await saveLocalDatabase(symbolKey, symbolData) // save the modified symbol data
        // let testing = await loadLocalDatabase(symbolKey) // test get object back
        // debugger
    }

    const downloadSymbolQuote = async function (symbol) {
        // get the symbol delayed quote from the IEX cloud
        const basehtml = `${iexData.BasehtmlCloud}`
        const token = `token=${iexData.PublishableToken}`
        const version = iexData.Version
        const request = axios
            .get(`${basehtml}${version}/stock/${symbol}/delayed-quote?${token}`)
        let res = await request
        return res.data
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
