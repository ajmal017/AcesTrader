// appGetSymbolData.js

import { getIEXData } from '../lib/apiGetIEXData'
import { loadLocalState, saveLocalState } from '../lib/localStateStorage'
let cloneDeep = require('lodash.clonedeep')

const METAKEY = "METADATA"

export const getSymbolData = async function (symbol, range, closeOnly, useSandbox) {

    const date = new Date() // today's date

    // Allow for different versions of the symbol's price file
    let symbolKey = `${symbol.toUpperCase()}-${range}-${closeOnly ? 'CloseOnly' : ''}-${useSandbox ? 'Sandbox' : ''}`

    // localStorage.removeItem(METAKEY) //TEMP ========== use this to reset state ===========

    let metaData = getCurrentMetaData(date) // get the current symbol price data
    // debugger
    if (metaData[symbolKey]) {
        // symbol price data is available for yesterday's end-of-day prices
        let values = cloneDeep(metaData[symbolKey])
        // reformate the dates for expected format after the JSON parsing changes
        let data = values.map((obj) => {
            let date = obj.date
            obj.date = new Date(date)
            return obj
        })
        return data
    }
    // Download an end-of-day price series for yesterday
    const symbolData = downloadSymbolData(symbol, range, closeOnly, useSandbox)
    let priceData = await symbolData
    metaData[symbolKey] = priceData // add the new price data
    saveLocalState(METAKEY, cloneDeep(metaData)) // updated value for today
    // debugger
    return priceData
}

const downloadSymbolData = async function (symbol, range, closeOnly, useSandbox) {
    // get the symbol price series data from the IEX cloud
    let data = getIEXData(symbol, range, closeOnly, useSandbox)
    let symbolData = await data
    // debugger
    return symbolData
}

const getCurrentMetaData = function (date) {
    // This returns a metaData object with today's date
    // and end-of-day price data for the previous trading day
    // for any symbols that were already downloaded today.
    // This reduces IEX costs by not repeating downloads unnecessarily.
    try {
        const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
        const defaultMetaData = { "date": theDate } // a fresh metaData object with today's date
        let metaData = loadLocalState(METAKEY) // get existing data if any
        if (!metaData || metaData === undefined) {
            saveLocalState(METAKEY, cloneDeep(defaultMetaData)) // initialize with a fresh value for today
            return defaultMetaData // this is the current metaData, empty of any price data
        }
        const existingDate = new Date(metaData.date)
        const timeDiff = new Date(theDate) - existingDate
        const daysOld = Math.round(Math.abs(timeDiff / (1000 * 3600 * 24)))
        if (daysOld === 1 || daysOld === 2) {
            // daysOld==1 could be on Sunday with Saturday's data being Fridays end-of-day prices,
            // or could be on Monday with Sunday's data also being Fridays end-of-day prices.
            // daysOld==2 could be on Monday with Saturday's data being Fridays end-of-day prices.
            // These prices are good for Monday and do not need to be downloaded again.
            const day = date.getDay() // gets today's day of the week (from 0-6, 0=Sunday)
            if (day === 0 || day === 1) {
                // today is Sunday or Monday
                metaData.date = theDate // update the date to today
                saveLocalState(METAKEY, cloneDeep(metaData)) // updated value for today
                return metaData // this is now the current metaData, with Saturday's existing valid price data for Friday's end-of-day
            }
        }
        if (daysOld > 0) {
            // All requests for symbol data will download end-of-day prices for prior trading day
            saveLocalState(METAKEY, cloneDeep(defaultMetaData)) // initialize with a fresh value for today
            return defaultMetaData // this is the new current metaData, empty of any price data
        }
        return metaData // this is the existing current metaData with symbols price data downloaded so far today
    } catch (error) {
        console.log('getCurrentMetaData error:', error.message)
        // alert('getCurrentMetaData error: ' + error.message) //rude interruption to user
        debugger // pause for developer
    }
}