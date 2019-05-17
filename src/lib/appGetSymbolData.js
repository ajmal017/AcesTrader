// appGetSymbolData.js

import { getIEXData } from '../lib/apiGetIEXData'
import { loadLocalDatabase, saveLocalDatabase, clearLocalDatabase } from '../lib/localDatabaseStorage'
let cloneDeep = require('lodash.clonedeep')

export const getSymbolData = async function (symbol, range, closeOnly, useSandbox) {

    // const useFirebase = true // save IEX price data in Firebase realtime data base //BCM

    // Allow for different versions of the symbol's price file
    const symbolKey = `${symbol.toUpperCase()}-${range}${closeOnly ? '-CloseOnly' : ''}${useSandbox ? '-Sandbox' : ''}`
    const date = new Date() // today's date

    // await clearLocalDatabase() //<==TEMP ===== use this to reset the db content ==========


    // //******************************** */
    // // const KEY1 = "testKey1"
    // // const VALUE1 = [{ date: "2019-5-7" }, { close: 111 }]
    // // await set(KEY1, VALUE1)
    // // const value1 = await get(KEY1)
    // // debugger
    // const KEY2 = "testKey2"
    // const VALUE2 = [{ date: "2010-5-7", close: 222 }, { date: "2010-9-7", close: 333 }]
    // await saveLocalDatabase(KEY2, VALUE2)
    // const value2 = await loadLocalDatabase(KEY2)
    // debugger
    // //******************************** */

    // // ******************************** */
    // const MetaKey = "MetaKey-DateObject"
    // // const theDay = date.getDay()
    // const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
    // const defaultMetaData = { "date": theDate } // a fresh metaData object with today's date
    // await saveLocalDatabase(MetaKey, defaultMetaData)
    // let metaData = await loadLocalDatabase(MetaKey) // get existing date marker if any
    // const metaDate = metaData.date
    // debugger
    // //******************************** */


    setCurrentMetaData(date) // confirm the local db will return correct symbol price data

    let symbolData = await loadLocalDatabase(symbolKey) // get price series from the cache
    if (symbolData) {

        // symbolData = await constructTodayBar(symbolData) // under construction

        // symbol price data is available for yesterday's end-of-day prices
        // this data may have a constructed daily bar for today's prices (under development)
        let values = cloneDeep(symbolData)
        // reformate the dates for expected format after the JSON parsing changes
        let data = values.map((obj) => {
            let date = obj.date
            obj.date = new Date(date)
            return obj
        })
        return data
    }
    // Download an end-of-day price series for yesterday
    symbolData = await downloadSymbolData(symbol, range, closeOnly, useSandbox)
    await saveLocalDatabase(symbolKey, symbolData) // added data for today
    // let testing = await loadLocalDatabase(symbolKey) // test get object back ==== BCM
    // debugger //BCM
    return symbolData
}

// const constructTodayBar = async function (symbolData) {}

const downloadSymbolData = async function (symbol, range, closeOnly, useSandbox) {
    // get the symbol price series data from the IEX cloud
    let data = getIEXData(symbol, range, closeOnly, useSandbox)
    let symbolData = await data
    // debugger //BCM
    return symbolData
}

const setCurrentMetaData = async function (date) {
    // This tests the db marker object's date against today's date
    // to ensure that the db will return the correct
    // end-of-day price data for the previous trading day
    // for any symbols that were already downloaded.
    // This reduces IEX costs by not repeating downloads unnecessarily.
    try {
        const MetaKey = "MetaKey-DateObject"
        const theDay = date.getDay()
        const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
        const defaultMetaData = { "date": theDate } // prepare a fresh metaData object with today's date

        let metaData = await loadLocalDatabase(MetaKey) // get existing date marker if any
        // debugger //BCM
        if (!metaData || metaData === undefined) {
            clearLocalDatabase() // start fresh today
            await saveLocalDatabase(MetaKey, defaultMetaData) // initialize with a date value for today
            return // this is the current metaData,  the db is empty of any price data
        }
        const existingDate = new Date(metaData.date) // the current db date marker
        const timeDiff = new Date(theDate) - existingDate
        const daysOld = Math.round(Math.abs(timeDiff / (1000 * 3600 * 24)))
        if (daysOld === 1 && theDay === 0) {
            // today is Sunday and data is Saturday's end-of-day prices from Friday, so still good.
            // These prices are good and do not need to be downloaded again.
            return // no change
        }
        if (daysOld === 2 && theDay === 1) {
            // today is Monday and data is Saturday's end-of-day prices from Friday, so still good.
            // These prices are good and do not need to be downloaded again.
            return // no change
        }
        if (daysOld > 0) {
            // The current db price data is stale, so start fresh now
            clearLocalDatabase() // start fresh today
            await saveLocalDatabase(MetaKey, defaultMetaData) // initialize with a date value for today
            // All requests for symbol data will download new end-of-day prices for prior trading day
            return // this is the current metaData, the db is empty of any price data
        }
        return // the existing db is good and has symbols price data downloaded so far today for prior trading day
    } catch (error) {
        console.log('setCurrentMetaData error:', error.message)
        // alert('setCurrentMetaData error: ' + error.message) //rude interruption to user
        debugger // pause for developer
    }
}