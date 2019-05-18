// appSetTheLocalDatabase.js

import { loadLocalDatabase, saveLocalDatabase, clearLocalDatabase } from '../lib/localDatabaseStorage'

export const setTheLocalDatabase = async function (date) {
    // This tests the DB marker object's date against today's date
    // to ensure that the DB will return the correct
    // end-of-day price data for the previous trading day
    // for any symbols that were downloaded already.
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
        console.log('setTheLocalDatabase error:', error.message)
        // alert('setTheLocalDatabase error: ' + error.message) //rude interruption to user
        debugger // pause for developer
    }
}