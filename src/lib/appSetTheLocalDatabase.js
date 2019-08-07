// appSetTheLocalDatabase.js

import { loadLocalDatabase, saveLocalDatabase, clearLocalDatabase } from '../lib/localDatabaseStorage'
import { getDaysDiff } from '../lib/appGetDaysDiff'

export const setTheLocalDatabase = async function (date) {
    // This tests the DB marker object's date against today's date
    // to ensure that the DB will return the correct
    // end-of-day price data for the previous trading day
    // for any symbols that were downloaded already.
    // This reduces IEX costs by not repeating downloads unnecessarily.
    // This fuction returns the found daysOld value for optional use by the caller.
    try {
        const MetaKey = "MetaKey-DateObject"
        const theDay = date.getDay()
        const defaultMetaData = { "date": date } // prepare a fresh metaData object with today's date
        // const theDate = `${date.getMonth() + 1}/${date.getDate()}/${('' + date.getFullYear()).substring(2, 4)}`
        // const defaultMetaData = { "date": theDate } // prepare a fresh metaData object with today's date

        let metaData = await loadLocalDatabase(MetaKey) // get existing date marker if any
        if (!metaData || metaData === undefined) {

            // console.log('Start fresh symbol database')

            await clearLocalDatabase() // start fresh today
            await saveLocalDatabase(MetaKey, defaultMetaData) // initialize with a date value for today
            return -1 // Established a new metaData record, the DB is empty of any price data
        }
        // date = new Date(2020, 8, 26) //*********** */TEST TEST TEST****************
        const existingDate = metaData.date // the current DB date marker
        const daysOld = getDaysDiff(existingDate, date)
        // debugger //******** */TEST TEST TEST**using the fake date created above**************
        if (daysOld === 0) {
            // the existing DB is good and has cached price data downloaded so far today for the prior trading day
            return daysOld // no change, try to get specified symbol from cache
        }
        if (daysOld === 1 && theDay === 0) {
            // today is Sunday and data is Friday's end-of-day prices from Saturday's update, so still good.
            // These prices are good and do not need to be downloaded again.
            return daysOld // no change, try to get specified symbol from cache
        }
        if ((daysOld === 2 || daysOld === 1) && theDay === 1) {
            // today is Monday and data is Friday's end-of-day prices from Saturday's or Sunday's update, so still good.
            // These prices are good and do not need to be downloaded again.
            return daysOld // no change, try to get specified symbol from cache
        }
        // The current db price data is stale, so start fresh now

        // console.log(`Reset symbol database, daysOld=${daysOld}`)

        await clearLocalDatabase() // start fresh today
        await saveLocalDatabase(MetaKey, defaultMetaData) // initialize with a date value for today
        // All requests for symbol data will download new end-of-day prices for prior trading day
        return daysOld // Established a new metaData record, the DB is empty of any price data

    } catch (error) {
        console.log('setTheLocalDatabase error:', error.message)
        // alert('setTheLocalDatabase error: ' + error.message) //rude interruption to user
        debugger // pause for developer
    }
}